import invokeQueue from './invokeQueue.js'
import { triggerDeps } from '../callbacks.js'

// when state is mutated, find cbs that should be triggered for given path
// triggering callbacks in beforeUpdate and afterUpdate may mutate the state further
// which would trigger some more callbacks, to avoid calling the same cb more than once, build a queue
// once a cb is added in queue it is not added again
function onMutate (path, old) {
  // to avoid infinite loop
  // if this component triggered state change in parent and as a result component's own state is again mutated
  // this would create infinite loop, to prevent that, do not process such state mutation
  if (this.ignore_path === path[0]) return true

  // if queue is being built, don't invoke, invoke once the building is stopped
  if (!this.batching) invokeQueue.call(this)

  // don't use if else - value of this.batching will be changed by invokeQueue
  if (this.batching) triggerDeps.call(this, path, old)
}

export default onMutate
