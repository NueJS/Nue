import { cbQueuer } from '../callbacks.js'
import { hasSlice } from './slice.js'

// get the origin component where the value of the path is coming from
function origin (comp, path) {
  let target = comp
  while (!hasSlice(target.$Target, path)) {
    if (!target.sweet) return undefined
    target = target.sweet.closure.component
  }
  return target
}

// add Dep for given path on its origin
function addDep (path, cb, type) {
  const comp = origin(this, path)
  if (!comp) throw new Error('DOM can not depend on $.', path.join('.'), ' it is not valid')
  const qcb = cbQueuer.call(comp, cb, type)
  let target = comp.deps
  const lastIndex = path.length - 1

  path.forEach((c, i) => {
    if (!target[c]) target[c] = { $: new Map() }
    target = target[c]
    if (i === lastIndex) target.$.set(qcb, true)
  })

  // return cleanup to stop DOM updates when node is removed
  if (type === 'dom') return () => target.$.delete(qcb)
}

export default addDep
