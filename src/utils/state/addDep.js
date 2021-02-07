import { cbQueuer } from '../callbacks.js'
import DEV from '../dev/DEV.js'
import err from '../dev/error.js'
import { hasSlice } from './slice.js'

// get the origin component where the value of the path is coming from
function origin (comp, path) {
  let target = comp
  while (!hasSlice(target.$Target, path)) {
    if (!target.closure) return undefined
    target = target.closure
  }
  return target
}

// add Dep for given path on its origin
function addDep (baseComp, path, cb, type) {
  const comp = origin(baseComp, path)

  if (DEV) {
    if (!comp) {
      err({
        message: `Invalid state placeholder used in template : {{ ${path.join('.')} }}`,
        fix: `make sure that "${path.join('.')}" exists in state of <${baseComp.name}/> component or it's closure`,
        link: '',
        code: -1,
        comp: baseComp
      })
    }
  }

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

export function addDeps (comp, deps, cb, type) {
  const removeDeps = deps.map(dep => addDep(comp, dep, cb, type))
  return removeDeps
}

export default addDep
