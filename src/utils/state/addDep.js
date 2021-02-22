import { cbQueuer } from '../callbacks.js'
import { origin } from '../closure.js'
import DEV from '../dev/DEV.js'
import errors from '../dev/errors.js'

// add Dep for given path on its origin
const addDep = (baseNue, path, cb, type) => {
  // get the nue where the state referred by path is coming from
  const nue = origin(baseNue, path)

  // throw if no origin is found
  if (DEV && !nue) throw errors.STATE_NOT_FOUND(baseNue.name, path.join('.'))

  // get the higher order cb that will only call the cb once every batch
  const qcb = cbQueuer(nue, cb, type)

  // start from the root of deps object
  let target = nue.deps

  const lastIndex = path.length - 1

  // add qcb in dep table at appropriate location
  path.forEach((c, i) => {
    if (!target[c]) target[c] = { $: new Map() }
    target = target[c]
    if (i === lastIndex) target.$.set(qcb, true)
  })

  // return removeDep function that can remove the qcb from the deps table
  return () => target.$.delete(qcb)
}

// returns an array of removeDep functions
export const addDeps = (nue, deps, cb, type) => deps.map(dep => addDep(nue, dep, cb, type))

export default addDep
