/**
 * swap items at indexes i and j in array arr
 * @param {Array<any>} arr
 * @param {number} i
 * @param {number} j
 */
export const swap = (arr, i, j) => {
  [arr[i], arr[j]] = [arr[j], arr[i]]
}

/**
 * shorthand to insert value at index i in arr
 * @param {Array<any>} arr
 * @param {number} i
 * @param {any} value
 */
export const insert = (arr, i, value) => {
  arr.splice(i, 0, value)
}

// convert array to hash with hash key as item's value and hash value as item's index
/**
 * @template X
 * @param {Array<X>} arr
 * @returns {{[key: X]: number}}
 */
export const arrayToHash = (arr) =>
  arr.reduce((hash, value, i) => {
    hash[value] = i // why ts-error ?
    return hash
  }, {})

/**
 * return true if the x is defined
 * @param {any} x
 * @returns {boolean}
 */
export const isDefined = x => x !== undefined

/**
 * return true if the character is uppercase
 * @param {string} str
 * @returns {boolean}
 */
export const isUpper = (str) => /[A-Z]/.test(str)

/**
 * return lowercase string
 * @param {string} str
 * @returns {string}
 */
export const lower = (str) => str.toLowerCase()

/**
 * convert string to upperCase
 * @param {string} str
 * @returns {string}
 */
export const upper = (str) => str.toUpperCase()

/**
 * execute all functions in array and clear array
 * @param {Array<Function>} arr
 */
export const flushArray = (arr) => {
  arr.forEach(fn => fn())
  arr.length = 0
}

/**
 * checks if two arrays of primitive values are equal or not
 * @param {Array<string>} arr1
 * @param {Array<string>} arr2
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
