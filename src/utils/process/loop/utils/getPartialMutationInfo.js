const getPartialMutationInfo = (mutations, arrayPathString, arrayPath) => {
  const dirtyIndexes = new Set()
  const stateUpdatedIndexes = new Set()
  const arrayPathLength = arrayPath.length

  mutations.forEach(mutation => {
    const { path } = mutation
    const arrayMutated = path.join('.').startsWith(arrayPathString)

    if (arrayMutated) {
      const endsWithIndex = path.length === arrayPathLength + 1
      const arrayProp = path[arrayPathLength]
      // when manually length is set, indexes from newValue to oldValue-1 are removed
      if (arrayProp === 'length') {
        const { newValue, oldValue } = mutation
        for (let i = newValue; i < oldValue; i++) dirtyIndexes.add(i)
      } else {
        const index = Number(arrayProp)
        if (endsWithIndex) dirtyIndexes.add(index)
        else stateUpdatedIndexes.add(index)
      }
    }
  })

  return [dirtyIndexes, stateUpdatedIndexes]
}

export default getPartialMutationInfo
