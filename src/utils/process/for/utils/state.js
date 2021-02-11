import { TARGET } from '../../../symbols'
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
      const state = comps[i].nue.$
      // update index
      if (state[TARGET][$index] !== i) {
        state[$index] = i
      }
    }
  }

  const diffIndexes = arrayDiff(newState.value, oldState.value)
  diffIndexes.forEach(i => {
    comps[i].nue.$[$each] = newState.value[i]
  })
}
