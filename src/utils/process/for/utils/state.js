import arrayDiff from '../diff/arrayDiff'
import { getArray, getHashArray } from './get'

export const getNewState = (forInfo, comp) => {
  const array = getArray(forInfo, comp)
  return {
    hash: getHashArray(forInfo, array),
    value: array
  }
}

export const updateCompState = (newState, { comps, forInfo, oldState, $index, $each }) => {
  if (forInfo.at) {
    // const movedComps = comps.map(c => c.isMoved)
    for (let i = 0; i < comps.length; i++) {
      const target = comps[i]
      // update index
      if (target.$.__target__[$index] !== i) {
        // console.log('update index state', i)
        target.$[$index] = i
      }
    }
  }

  const diffIndexes = arrayDiff(newState.value, oldState.value)
  console.log('find diff indexes', diffIndexes)

  diffIndexes.forEach(i => {
    comps[i].$[$each] = newState.value[i]
  })
}
