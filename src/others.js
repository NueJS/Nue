/**
 * swap items at indexes i and j in array arr
 * @param {any[]} arr
 * @param {number} i
 * @param {number} j
 */
export const swap = (arr, i, j) => {
  [arr[i], arr[j]] = [arr[j], arr[i]]
}

/**
 * shorthand to insert value at index i in arr
 * @param {any[]} arr
 * @param {number} i
 * @param {any} value
 */
export const insert = (arr, i, value) => {
  arr.splice(i, 0, value)
}

// convert array to hash with hash key as item's value and hash value as item's index
/**
 * @param {string[]} arr
 * @returns {Record<string, number>}
 */
export const arrayToHash = (arr) => {
  const init = /** @type {Record<string, number>} */({})
  return arr.reduce((hash, value, i) => {
    hash[value] = i
    return hash
  }, init)
}

/**
 * return true if the x is defined
 * @param {any} x
 * @returns {boolean}
 */
export const isDefined = x => x !== undefined

/**
 * execute all functions in array and clear array
 * @param {Function[]} arr
 */
export const flushArray = (arr) => {
  arr.forEach(fn => fn())
  arr.length = 0
}

/**
 * checks if two arrays of primitive values are equal or not
 * @param {string[]} arr1
 * @param {string[]} arr2
 * @returns {boolean}
 */
export const arraysAreShallowEqual = (arr1, arr2) => {
  if (arr1.length !== arr2.length) return false
  return arr1.every((item, index) => item === arr2[index])
}

/**
 * return true if x is object
 * @param {any} x
 * @returns {boolean}
 */
export const isObject = x => typeof x === 'object' && x !== null
