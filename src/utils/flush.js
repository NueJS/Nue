import { flushBatch } from './batch'

/**
 * flush events and batched callbacks to outside world
 * @param {Comp} comp
 * @param {Mutation[]} mutations
 */
export const flush = (comp, mutations) => {

  const { _beforeUpdate, _afterUpdate } = comp._hookCbs

  // before updates
  _beforeUpdate.forEach(cb => cb(mutations))

  // updates
  comp._batches.forEach(batch => flushBatch(batch, mutations))

  // after updates
  _afterUpdate.forEach(cb => cb(mutations))

}

/**
 * schedule the flush
 * @param {Comp} comp
 */
export const scheduleFlush = (comp) => {
  // schedule flush
  setTimeout(() => {
    // do a shallow clone because comp.batchInfo will be cleared out
    const mutations = [...comp._mutations]

    flush(comp, mutations)
    // clear batch info
    comp._mutations.length = 0
    // reset flag
    comp._flush_scheduled = false
  }, 0)

  // start batching
  comp._flush_scheduled = true
}
