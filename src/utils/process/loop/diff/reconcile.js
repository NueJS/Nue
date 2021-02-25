import { arrayToHash, insert, swap } from '../../../others'

export const removed = (index) => ({ type: 'remove', index })
export const created = (index, value) => ({ type: 'create', index, value })
export const swapped = (i, j) => ({ type: 'swap', indexes: [i, j] })

const reconcile = (oldState, newState) => {
  const steps = []

  // remove, removed items from oldState O(n)
  for (let i = 0; i < oldState.keys.length; i++) {
    const key = oldState.keys[i]
    if (!(key in newState.keyHash)) {
      steps.push(removed(i))
      oldState.keys.splice(i, 1)
      oldState.values.splice(i, 1)
      i--
    }
  }

  // insert, new items from oldState O(n)
  for (let i = 0; i < newState.keys.length; i++) {
    const key = newState.keys[i]
    if (!(key in oldState.keyHash)) {
      steps.push(created(i, newState.values[i]))
      insert(oldState.keys, i, key)
      insert(oldState.values, i, newState.values[i])
    }
  }

  // swap, swapped values in newState.keys in arr
  for (let i = 0; i < oldState.keys.length; i++) {
    const key = oldState.keys[i]
    if (key !== newState.keys[i]) {
      // find where its position in new oldState.keys
      const iShouldBe = newState.keyHash[key]
      steps.push(swapped(i, iShouldBe))
      swap(oldState.keys, i, iShouldBe)
      swap(oldState.values, i, iShouldBe)
      i-- // keep checking current index, till we set correct item it this index
    }
  }

  // calculate the keyHash again from the modified keys
  oldState.keyHash = arrayToHash(oldState.keys)

  return steps
}

export default reconcile
