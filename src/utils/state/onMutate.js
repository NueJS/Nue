import { scheduleFlush } from '../flush.js'
import { triggerDeps } from '../callbacks.js'
import { FLUSH_SCHEDULED, SUBSCRIPTIONS } from '../constants.js'

// when state is mutated, add the cb in batch
// schedule flush if not already scheduled
const onMutate = (compNode, path) => {
  triggerDeps(compNode[SUBSCRIPTIONS], path)
  if (!compNode[FLUSH_SCHEDULED]) scheduleFlush(compNode)
}

export default onMutate
