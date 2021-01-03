import { insert, swap } from '../../../others'

function reconcile (oldState, newState) {
  const steps = []

  // remove, removed values
  for (let i = 0; i < oldState.hash.length; i++) {
    const j = newState.hash.indexOf(oldState.hash[i])
    if (j === -1) {
      steps.push({ type: 'remove', index: i })
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
    // console.log(JSON.stringify(oldState.value))
    if (oldState.hash[i] !== newState.hash[i]) {
      // find where its position in new oldState.hash
      const iShouldBe = newState.hash.indexOf(oldState.hash[i])
      steps.push({ type: 'swap', indexes: [i, iShouldBe] })
      swap(oldState.hash, i, iShouldBe)
      swap(oldState.value, i, iShouldBe)
      i-- // keep checking the index i until we find the value which belongs to this index
    }
  }

  return steps
}

export default reconcile
