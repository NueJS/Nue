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

  // order must be : remove - add - swap

  // remove, removed values in newArr from arr
  for (let i = 0; i < arr.length; i++) {
    const j = newArr.findIndex(x => x === arr[i])
    if (j === -1) {
      steps.push({ type: 'remove', index: i })
      arr.splice(i, 1)
      i--
    }
  }

  // insert, new values in newArr to arr at its position
  for (let i = 0; i < newArr.length; i++) {
    const value = newArr[i]
    const j = arr.findIndex(x => x === value)
    if (j === -1) {
      steps.push({ type: 'create', index: i, value })
      insert(arr, i, value)
    }
  }

  // console.log('before swapping : ', arr)

  // swap, swapped values in newArr in arr
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== newArr[i]) {
      // find where its position in new array
      const iShouldBe = newArr.findIndex(n => n === arr[i])
      steps.push({ type: 'swap', indexes: [i, iShouldBe] })
      swap(arr, i, iShouldBe)
    }
  }

  return [steps, arr]
}

module.exports = reconcile
// export default reconcile
