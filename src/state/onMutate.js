
import { scheduleFlush } from '../batch/scheduleFlush'
import { notify } from '../subscription/notify'

/**
 * when state is mutated, add the cb in batch
 * schedule flush if not already scheduled
 * @param {Comp} comp
 * @param {StatePath} path
 */
export const onMutate = (comp, path) => {
  notify(comp._subscriptions, path)
  if (!comp._flush_scheduled) scheduleFlush(comp)
}
