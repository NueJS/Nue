
let i = 0
export const uid = () => '' + i++

/**
 *
 * @param {Array} arr
 * @param {Function} cb
 */
export function reverseForEach (arr, cb) {
  for (let i = arr.length - 1; i >= 0; i--) {
    cb(arr[i], i)
  }
}
