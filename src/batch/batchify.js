/**
 * higher order function that returns a new function that when called adds the cb to given batch
 * @param {SubCallBack | Function} cb
 * @param {Batch} batch
 */
export const batchify = (cb, batch) => () => batch.add(cb)
