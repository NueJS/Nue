const swap = (arr, i, j) => {
  const temp = arr[i]
  arr[i] = arr[j]
  arr[j] = temp
}

const insert = (arr, i, value) => {
  arr.splice(i, 0, value)
}

function reconcile (oldState, newState) {
  // debugger
  const steps = []

  // order must be : 1. remove  2. add  3. swap

  // remove, removed values
  for (let i = 0; i < oldState.hash.length; i++) {
    const j = newState.hash.indexOf(oldState.hash[i])
    if (j === -1) {
      steps.push({ type: 'remove', index: i })
      // arr.splice(i, 1)
      oldState.hash.splice(i, 1)
      oldState.value.splice(i, 1)
      i--
    }
  }

  // insert, new values in newState.hash to arr at its position
  for (let i = 0; i < newState.hash.length; i++) {
    const hash = newState.hash[i]
    const j = oldState.hash.indexOf(hash)
    if (j === -1) {
      steps.push({ type: 'create', index: i, value: newState.value[i] })
      insert(oldState.hash, i, hash)
      insert(oldState.value, i, newState.value[i])
    }
  }

  // swap, swapped values in newState.hash in arr
  for (let i = 0; i < oldState.hash.length; i++) {
    if (oldState.hash[i] !== newState.hash[i]) {
      // find where its position in new oldState.hashay
      const iShouldBe = newState.hash.indexOf(oldState.hash[i])
      steps.push({ type: 'swap', indexes: [i, iShouldBe] })
      swap(oldState.hash, i, iShouldBe)
      swap(oldState.value, i, iShouldBe)
    }
  }

  return steps
}

export default reconcile
