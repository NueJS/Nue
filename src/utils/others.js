export function reverseForEach (arr, cb) {
  for (let i = arr.length - 1; i >= 0; i--) {
    cb(arr[i], i)
  }
}

export const swap = (arr, i, j) => {
  [arr[i], arr[j]] = [arr[j], arr[i]]
}

export const uid = /*#__PURE__ */ (() => {
  let i = 0
  return () => i++
})()

export const insert = (arr, i, value) => {
  arr.splice(i, 0, value)
}

export const arrayToHash = (arr) =>
  arr.reduce((hash, value, i) => {
    hash[value] = i
    return hash
  }, {})
