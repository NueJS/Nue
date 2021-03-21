
/**
 * go through batchInfoArray and filter out info that is relevant for updating the looped components
 * @param {import('../../../types').batchInfoArray} batchInfoArray
 * @param {string} arrayPathString
 * @param {import('../../../types').path} arrayPath
 * @returns {[number[], import('../../../types').stateUpdates]}
 */

const getPartialMutationInfo = (batchInfoArray, arrayPathString, arrayPath) => {
  /**
   *  set of indexes, where the items are either moved, removed or added
   *  @type {Set<number>}
   * */
  const dirtyIndexesSet = new Set()

  /**
   * object containing information about what parts of state has been mutated
   * @type {import('../../../types').stateUpdates}
   * */
  const stateUpdates = {}

  const arrayPathLength = arrayPath.length

  batchInfoArray.forEach(batchInfo => {
    const { newValue, oldValue, getPath } = batchInfo

    // get the fresh path
    const path = getPath()

    // if the batchInfo path startsWith same path as of array's path
    // it means the array is the target, array mutated
    const arrayMutated = path.join('.').startsWith(arrayPathString)

    // if the batchInfo updates the array
    if (arrayMutated) {
      // from index 0 to arrayPathLength - 1, arrayPath matches
      // at index: arrayPathLength, we get the key at which batchInfo happened
      const key = path[arrayPathLength]

      // if batchInfo path's length is just 1 more than array's path,
      // it means that it is assigning a newVale to key
      const pathEndsWithKey = path.length === arrayPathLength + 1

      // if a new item is assigned at key
      // ex: users[2] = someUser or users.length = 4
      if (pathEndsWithKey) {
        if (key === 'length') {
          // when length is set, it means that it was manually set to shorten the array from length oldValue to newValue
          // and newValue < oldValue
          // if newValue becomes the new length, last item in array would be at index newValue - 1
          // which means that items it index newValue, newValue + 1, ... oldValue - 1 are removed
          // add the removed indexes in dirtyIndexes
          for (let i = newValue; i < oldValue; i++) dirtyIndexesSet.add(i)
        }
        else dirtyIndexesSet.add(Number(key))
      }

      // if the batchInfo path does not end with index, but goes deeper than that
      // means that item itself was mutated
      // ex: users[2].name = 'Manan'
      else {
        const info = {
          path: path.slice(arrayPathLength + 1),
          newValue
        }
        if (key in stateUpdates) stateUpdates[key].push(info)
        else stateUpdates[key] = [info]
      }
    }
  })

  // convert dirtyIndexesSet to array and then sort
  const dirtyIndexes = [...dirtyIndexesSet].sort((a, b) => a - b)

  return [dirtyIndexes, stateUpdates]
}

export default getPartialMutationInfo
