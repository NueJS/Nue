import { insert, swap } from '../../../others'

function reconcile (oldState, newState) {
  const steps = []

  // remove, removed values
  for (let i = 0; i < oldState.keys.length; i++) {
    if (newState.keyHash[oldState.keys[i]] === undefined) {
      steps.push({ type: 'remove', index: i })
      oldState.keys.splice(i, 1)
      oldState.values.splice(i, 1)
      i--
    }
  }

  // insert, new values in newState.keys to arr at its position
  for (let i = 0; i < newState.keys.length; i++) {
    const hash = newState.keys[i]
    if (oldState.keyHash[hash] === undefined) {
      steps.push({ type: 'create', index: i, value: newState.values[i] })
      insert(oldState.keys, i, hash)
      insert(oldState.values, i, newState.values[i])
    }
  }

  // swap, swapped values in newState.keys in arr
  for (let i = 0; i < oldState.keys.length; i++) {
    if (oldState.keys[i] !== newState.keys[i]) {
      // find where its position in new oldState.keys
      const iShouldBe = newState.keyHash[oldState.keys[i]]
      steps.push({ type: 'swap', indexes: [i, iShouldBe] })
      swap(oldState.keys, i, iShouldBe)
      swap(oldState.values, i, iShouldBe)
      i-- // keep checking the index i until we find the value which belongs to this index
    }
  }

  return steps
}

export default reconcile
