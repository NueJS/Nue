import DEV from '../../../dev/DEV'
import { TARGET } from '../../../symbols'
import checkUniquenessOfKeys from '../dev/checkUniquenessOfKeys'
import arrayDiff from '../diff/arrayDiff'
import { getKeys } from './get'

export const getNewState = (blob) => {
  const { forInfo, comp } = blob
  // get new array from state
  const value = forInfo.map.getValue(comp.$)
  // using the new array, re-compute the keys for each item
  const hash = getKeys(blob, value)
  if (DEV) checkUniquenessOfKeys(comp, hash)
  return {
    hash,
    value
  }
}

// @todo - do not update index - we need to update props now
export const updateCompState = (newState, { comps, forInfo, oldState, initialized }) => {
  if (!comps.length || !initialized) return
  const { as, at } = forInfo

  // if index is used, update index state of all components
  if (forInfo.at) {
    // const movedComps = comps.map(c => c.isMoved)
    for (let i = 0; i < comps.length; i++) {
      const state = comps[i].nue.$
      // update index
      if (state[TARGET][at] !== i) {
        state[at] = i
      }
    }
  }

  // get the indexes where the state is updated
  // for those components, update the state
  const diffIndexes = arrayDiff(newState.value, oldState.value)
  diffIndexes.forEach(i => {
    comps[i].nue.$[as] = newState.value[i]
  })
}
