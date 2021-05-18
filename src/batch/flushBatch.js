/**
 * run all callbacks of a batch with mutations info
 * @param {Batch} batch
 * @param {Mutation[]} mutations
 */

export const flushBatch = (batch, mutations) => {
  batch.forEach(cb => cb(mutations))
  batch.clear()
}
