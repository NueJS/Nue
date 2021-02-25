import { cbQueuer } from '../callbacks.js'
import { origin } from '../closure.js'
import DEV from '../dev/DEV.js'
import errors from '../dev/errors.js'

// subscribe to slice of state pointed by the path in baseNue
// when that slice is updated, call the callback in "queueName" queue
const subscribe = (baseNue, path, cb, queueName) => {
  // get the nue where the state referred by path is coming from
  const nue = origin(baseNue, path)

  // throw if no origin is found
  if (DEV && !nue) throw errors.STATE_NOT_FOUND(baseNue.name, path.join('.'))

  // get the higher order cb that will only call the cb once every batch
  const qcb = cbQueuer(nue, cb, queueName)

  // start from the root of subscribers
  let target = nue.subscribers

  // add qcb in path table at appropriate location
  // map is used to unsubscribe in constant time
  const lastIndex = path.length - 1
  path.forEach((key, i) => {
    if (!target[key]) target[key] = { $: new Set() }
    target = target[key]
    if (i === lastIndex) target.$.add(qcb)
  })

  // return unsubscribe function to remove subscription
  return () => target.$.delete(qcb)
}

// returns an array of removeDep functions
export const subscribeMultiple = (nue, paths, cb, queueName) => paths.map(path => subscribe(nue, path, cb, queueName))

export default subscribe
