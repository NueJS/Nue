// swap items at indexes i and j in array arr
export const swap = (arr, i, j) => {
  [arr[i], arr[j]] = [arr[j], arr[i]]
}

// shorthand to insert value at index i in arr
export const insert = (arr, i, value) => {
  arr.splice(i, 0, value)
}

// convert array to hash with hash key as item's value and hash value as item's index
export const arrayToHash = (arr) =>
  arr.reduce((hash, value, i) => {
    hash[value] = i
    return hash
  }, {})

// return true if the x is defined
export const isDefined = x => x !== undefined

// return true if the character is uppercase
export const isUpper = (c) => /[A-Z]/.test(c)

// return lowercase string
export const lower = (s) => s.toLowerCase()

// return uppercase string
export const upper = (s) => s.toUpperCase()

// execute all functions in array and clear array
export const flushArray = (arr) => {
  arr.forEach(fn => fn())
  arr.length = 0
}

// checks if two arrays of primitive values are equal or not
export const arraysAreShallowEqual = (arr1, arr2) => {
  if (arr1.length !== arr2.length) return false
  return arr1.every((item, index) => item === arr2[index])
}

export const isObject = x => typeof x === 'object' && x !== null
