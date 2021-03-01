// mutations is the batchInfo - an array of mutations done in one sync batch
// arrayPath is the path of the array in state
// arrayPathString is arrayPath.join('.')

// dirtyIndexes are the indexes at which new items are assigned
// stateUpdatedIndexes are the indexes at which items are mutated
const getPartialMutationInfo = (mutations, arrayPathString, arrayPath) => {
  const _dirtyIndexes = new Set()
  const _stateUpdatedIndexes = new Set()
  const arrayPathLength = arrayPath.length

  mutations.forEach(mutation => {
    const { newValue, oldValue, path } = mutation

    // if the mutation path startsWith same path as of array's path
    // it means the array is the target, array mutated
    const arrayMutated = path.join('.').startsWith(arrayPathString)

    // if the mutation updates the array
    if (arrayMutated) {
      // from index 0 to arrayPathLength - 1, arrayPath matches
      // at index: arrayPathLength, we get the key at which mutation happened
      const key = path[arrayPathLength]

      // if mutation path's length is just 1 more than array's path,
      // it means that it is assigning a newVale to key
      const pathEndsWithKey = path.length === arrayPathLength + 1

      // if a new item is assigned at key
      // ex: users[2] = someUser or users.length = 4
      if (pathEndsWithKey) {
        // when length is set, it means that it was manually set to shorten the array from length oldValue to newValue
        // and newValue < oldValue
        // if newValue becomes the new length, last item in array would be at index newValue - 1
        // which means that items it index newValue, newValue + 1, ... oldValue - 1 are removed
        if (key === 'length') {
          // add the removed indexes in dirtyIndexes
          for (let i = newValue; i < oldValue; i++) _dirtyIndexes.add(i)
        }
        else _dirtyIndexes.add(Number(key))
      }

      // if the mutation path does not end with index, but goes deeper than that
      // means that item itself was mutated
      // ex: users[2].name = 'Manan'
      else _stateUpdatedIndexes.add(Number(key))
    }
  })

  // convert _dirtyIndexes to array for sorting
  // then convert the sorted array to set so that we can get
  const dirtyIndexes = [..._dirtyIndexes].sort((a, b) => a - b)
  const stateUpdatedIndexes = [..._stateUpdatedIndexes]
  return [dirtyIndexes, stateUpdatedIndexes]
}

export default getPartialMutationInfo
