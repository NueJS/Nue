import { cbQueuer } from '../callbacks.js'
import { origin } from '../closure.js'
import DEV from '../dev/DEV.js'
import errors from '../dev/errors.js'

// add Dep for given path on its origin
const subscribe = (baseNue, path, cb, type) => {
  // get the nue where the state referred by path is coming from
  const nue = origin(baseNue, path)

  // throw if no origin is found
  if (DEV && !nue) throw errors.STATE_NOT_FOUND(baseNue.name, path.join('.'))

  // get the higher order cb that will only call the cb once every batch
  const qcb = cbQueuer(nue, cb, type)

  // start from the root of subscribers
  let target = nue.subscribers

  const lastIndex = path.length - 1

  // add qcb in dep table at appropriate location
  // map is used to unsubscribe in constant time
  path.forEach((c, i) => {
    if (!target[c]) target[c] = { $: new Set() }
    target = target[c]
    if (i === lastIndex) target.$.add(qcb)
  })

  // return unsubscribe to remove subscription
  return () => target.$.delete(qcb)
}

// returns an array of removeDep functions
export const subscribeMultiple = (nue, deps, cb, type) => deps.map(dep => subscribe(nue, dep, cb, type))

export default subscribe
