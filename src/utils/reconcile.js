const swap = (arr, i, j) => {
  const temp = arr[i]
  arr[i] = arr[j]
  arr[j] = temp
}

const insert = (arr, i, value) => {
  arr.splice(i, 0, value)
}

function reconcile (oldArr, newArr) {
  const steps = []
  const arr = [...oldArr]

  // order must be : 1. remove  2. add  3. swap

  // remove, removed values in newArr from arr
  for (let i = 0; i < arr.length; i++) {
    const j = newArr.indexOf(arr[i])
    if (j === -1) {
      steps.push({ type: 'remove', index: i })
      arr.splice(i, 1)
      i--
    }
  }

  // insert, new values in newArr to arr at its position
  for (let i = 0; i < newArr.length; i++) {
    const value = newArr[i]
    const j = arr.indexOf(value)
    if (j === -1) {
      steps.push({ type: 'create', index: i, value })
      insert(arr, i, value)
    }
  }

  // swap, swapped values in newArr in arr
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== newArr[i]) {
      // find where its position in new array
      const iShouldBe = newArr.indexOf(arr[i])
      steps.push({ type: 'swap', indexes: [i, iShouldBe] })
      swap(arr, i, iShouldBe)
    }
  }

  return [steps, arr]
}

export default reconcile
