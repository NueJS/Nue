export function reverseForEach (arr, cb) {
  for (let i = arr.length - 1; i >= 0; i--) {
    cb(arr[i], i)
  }
}

export const swap = (arr, i, j) => {
  [arr[i], arr[j]] = [arr[j], arr[i]]
}

// export const uid = () => Math.random().toString(36).replace(/[^a-z]+/g, '')

let i = 0
export const uid = () => '' + i++

export const insert = (arr, i, value) => {
  arr.splice(i, 0, value)
}
