import { cbQueuer } from '../callbacks.js'
import { origin } from '../closure.js'
import DEV from '../dev/DEV.js'
import errors from '../dev/errors.js'

// add Dep for given path on its origin
const addDep = (baseComp, path, cb, type) => {
  const comp = origin(baseComp, path)

  if (DEV && !comp) throw errors.STATE_NOT_FOUND(baseComp, path.join('.'))

  const qcb = cbQueuer(comp, cb, type)
  let target = comp.deps
  const lastIndex = path.length - 1

  path.forEach((c, i) => {
    if (!target[c]) target[c] = { $: new Map() }
    target = target[c]
    if (i === lastIndex) target.$.set(qcb, true)
  })

  // return cleanup to stop DOM updates when node is removed
  if (type === 'dom') {
    const removeDep = () => target.$.delete(qcb)
    return removeDep
  }
}

export const addDeps = (comp, deps, cb, type) => {
  const removeDeps = deps.map(dep => addDep(comp, dep, cb, type))
  return removeDeps
}

export default addDep
