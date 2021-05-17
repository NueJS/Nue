import { arrayToHash, insert, swap } from '../../../utils/array'
import { isDefined } from '../../../utils/type'

/**
 * return steps to reconcile oldState to newState
 * @param {ReconcileState} oldState
 * @param {ReconcileState} newState
 * @param {Array<number>} indexes
 * @returns {ReconcileSteps}
 */

export const reconcile = (oldState, newState, indexes) => {

  /** @type {ReconcileSteps} */
  const steps = {
    _remove: [],
    _add: [],
    _swap: []
  }

  // remove, removed items from oldState O(indexes)
  for (const di of indexes) {

    // keep checking for di if we keep finding that di was removed
    // @todo use x-- method instead of using while loop
    while (true) {

      const keyInOld = oldState._keys[di]

      // if the key can not be found it means that this key is a new key
      if (!isDefined(keyInOld)) break

      // if the key was present in the oldState, but not in newState, then this key was removed
      if (!(keyInOld in newState._keyHash)) {
        steps._remove.push(di)
        oldState._keys.splice(di, 1)
        oldState._values.splice(di, 1)
      }

      else {
        break
      }

    }

  }

  // insert, new items from oldState O(n)
  for (const di of indexes) {

    const key = newState._keys[di]

    // if the key is not present in the newState it means it was removed
    if (!isDefined(key)) continue

    // if the key does not exist in oldState, it's a newly added item
    if (!(key in oldState._keyHash)) {
      steps._add.push([di, newState._values[di]])
      insert(oldState._keys, di, key)
      insert(oldState._values, di, newState._values[di])
    }

  }

  // swap, swapped values in newState.keys in arr
  for (const di of indexes) {

    const key = oldState._keys[di]

    if (key !== newState._keys[di]) {
      // find where its position in new oldState.keys
      const iShouldBe = newState._keyHash[key]

      steps._swap.push([di, iShouldBe])
      swap(oldState._keys, di, iShouldBe)
      swap(oldState._values, di, iShouldBe)

      // x-- // keep checking current index, till we set correct item it this index
    }

  }

  // calculate the keyHash again from the modified keys
  oldState._keyHash = arrayToHash(oldState._keys)

  return steps
}
