import { CREATE, REMOVE, SWAP } from '../../../constants'
import { arrayToHash, insert, isDefined, swap } from '../../../others'

export const removed = (index) => ({ type: REMOVE, index })
export const created = (index, value) => ({ type: CREATE, index, value })
export const swapped = (i, j) => ({ type: SWAP, indexes: [i, j] })

const reconcile = (oldState, newState, dirtyIndexes) => {
  const steps = []
  // remove, removed items from oldState O(dirtyIndexes)
  for (const di of dirtyIndexes) {
    // keep checking for di if we keep finding that di was removed
    while (true) {
      const keyInOld = oldState.keys[di]
      // if the key can not be found it means that this key is a new key
      if (!isDefined(keyInOld)) break
      // if the key was present in the oldState, but not in newState, then this key was removed
      if (!(keyInOld in newState.keyHash)) {
        steps.push(removed(di))
        oldState.keys.splice(di, 1)
        oldState.values.splice(di, 1)
      } else {
        break
      }
    }
  }

  // insert, new items from oldState O(n)
  for (const di of dirtyIndexes) {
    const key = newState.keys[di]
    // if the key is not present in the newState it means it was removed
    if (!isDefined(key)) continue
    // if the key does not exist in oldState, it's a newly added item
    if (!(key in oldState.keyHash)) {
      steps.push(created(di, newState.values[di]))
      insert(oldState.keys, di, key)
      insert(oldState.values, di, newState.values[di])
    }
  }

  // swap, swapped values in newState.keys in arr
  for (const di of dirtyIndexes) {
    const key = oldState.keys[di]
    if (key !== newState.keys[di]) {
      // find where its position in new oldState.keys
      const iShouldBe = newState.keyHash[key]
      steps.push(swapped(di, iShouldBe))
      swap(oldState.keys, di, iShouldBe)
      swap(oldState.values, di, iShouldBe)
      // x-- // keep checking current index, till we set correct item it this index
    }
  }

  // calculate the keyHash again from the modified keys
  oldState.keyHash = arrayToHash(oldState.keys)

  return steps
}

export default reconcile
