/**
 * resolve the promise after waiting for given amount of time in ms
 * @param {number} ms
 */

export const wait = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms)
})
