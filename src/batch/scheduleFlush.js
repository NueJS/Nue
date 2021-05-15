import { flush } from './flush'

/**
 * schedule the flush
 * @param {Comp} comp
 */
export const scheduleFlush = (comp) => {

  comp._flush_scheduled = true

  setTimeout(() => {
    // do a shallow clone because comp.batchInfo will be cleared out
    const mutations = [...comp._mutations]

    flush(comp, mutations)

    // clear batch info
    comp._mutations.length = 0

    // reset flag
    comp._flush_scheduled = false
  }, 0)

}
