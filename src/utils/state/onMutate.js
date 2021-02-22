import invokeQueue from './invokeQueue.js'
import { triggerDeps } from '../callbacks.js'

// when state is mutated, find cbs that should be triggered for given path
// triggering callbacks in beforeUpdate and afterUpdate may mutate the state further
// which would trigger some more callbacks, to avoid calling the same cb more than once, build a queue
// once a cb is added in queue it is not added again
function onMutate (nue, path, old) {
  // if queue is being built, don't invoke, invoke once the building is stopped
  if (!nue.batching) invokeQueue(nue)

  // don't use if else - value of nue.batching will be changed by invokeQueue
  if (nue.batching) triggerDeps(nue, path, old)
}

export default onMutate
