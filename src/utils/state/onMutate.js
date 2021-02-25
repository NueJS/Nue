import flush from '../flush.js'
import { triggerDeps } from '../callbacks.js'

// when state is mutated, find cbs that should be triggered for given path
// triggering callbacks in beforeUpdate and afterUpdate may mutate the state further
// which would trigger some more callbacks, to avoid calling the same cb more than once, build a batches
// once a cb is added in batches it is not added again
const onMutate = (nue, path, old) => {
  // if batches is being built, don't invoke, invoke once the building is stopped
  if (!nue.batching) flush(nue)

  // don't use if else - value of nue.batching will be changed by flush
  if (nue.batching) triggerDeps(nue, path, old)
}

export default onMutate
