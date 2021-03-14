import { scheduleFlush } from '../flush.js'
import notify from '../subscription/notify'
import { FLUSH_SCHEDULED, SUBSCRIPTIONS } from '../constants.js'

/**
 * when state is mutated, add the cb in batch
 * schedule flush if not already scheduled
 * @param {import('../types').compNode} compNode
 * @param {import('../types').path} path
 */
const onMutate = (compNode, path) => {
  notify(compNode[SUBSCRIPTIONS], path)
  if (!compNode[FLUSH_SCHEDULED]) scheduleFlush(compNode)
}

export default onMutate
