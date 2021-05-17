import { flush } from './flush'

/**
 * schedule the flush
 * @param {Comp} comp
 */
export const scheduleFlush = (comp) => {

  comp._flush_scheduled = true

  setTimeout(() => {
    flush(comp)

    // assign a new array instead of changing the length to 0
    // so that component events api can use this mutations info
    comp._mutations = []

    // reset flag
    comp._flush_scheduled = false

  }, 0)

}
