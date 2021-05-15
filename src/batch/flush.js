import { flushBatch } from './flushBatch'

/**
 * flush events and batched callbacks to outside world
 * @param {Comp} comp
 * @param {Mutation[]} mutations
 */
export const flush = (comp, mutations) => {

  const { _beforeUpdate, _afterUpdate } = comp._eventCbs

  // before updates
  _beforeUpdate.forEach(cb => cb(mutations))

  // updates
  comp._batches.forEach(batch => flushBatch(batch, mutations))

  // after updates
  _afterUpdate.forEach(cb => cb(mutations))

}
