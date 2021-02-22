import { cbQueuer } from '../callbacks.js'
import { origin } from '../closure.js'
import DEV from '../dev/DEV.js'
import errors from '../dev/errors.js'

// add Dep for given path on its origin
const addDep = (baseComp, path, cb, type) => {
  const nue = origin(baseComp, path)

  if (DEV && !nue) throw errors.STATE_NOT_FOUND(baseComp, path.join('.'))

  const qcb = cbQueuer(nue, cb, type)
  let target = nue.deps
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

export const addDeps = (nue, deps, cb, type) => {
  const removeDeps = deps.map(dep => addDep(nue, dep, cb, type))
  return removeDeps
}

export default addDep
