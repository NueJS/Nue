import DEV from '../../../dev/DEV'
import { TARGET } from '../../../symbols'
import checkUniquenessOfKeys from '../dev/checkUniquenessOfKeys'
import arrayDiff from '../diff/arrayDiff'
import { getHashArray } from './get'

export const getNewState = (forInfo, comp) => {
  const value = forInfo.map.getValue(comp)[TARGET]
  const hash = getHashArray(forInfo, value)
  if (DEV) checkUniquenessOfKeys(comp, hash)

  return {
    hash,
    value
  }
}

export const updateCompState = (newState, { comps, forInfo, oldState }) => {
  if (!comps.length) return
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
