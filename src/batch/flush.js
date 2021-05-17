import { flushBatch } from './flushBatch'

/**
 * flush events and batched callbacks to outside world
 * @param {Comp} comp
 */
export const flush = (comp) => {

  const { _beforeUpdate, _afterUpdate } = comp._eventCbs
  const { _mutations } = comp

  // before updates
  _beforeUpdate.forEach(cb => cb(_mutations))

  // updates
  comp._batches.forEach(batch => flushBatch(batch, _mutations))

  // after updates
  _afterUpdate.forEach(cb => cb(_mutations))

}
