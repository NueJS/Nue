import DEV from '../../../dev/DEV'
import { arrayToHash } from '../../../others'
import checkUniquenessOfKeys from '../dev/checkUniquenessOfKeys'
import arrayDiff from '../diff/arrayDiff'

export const getNewState = (blob) => {
  const { nue, getArray, getKeys } = blob
  const values = getArray()
  const keys = getKeys()
  const keyHash = arrayToHash(keys)
  if (DEV) checkUniquenessOfKeys(nue, keys)
  return {
    keys,
    values,
    keyHash
  }
}

// @todo - do not update index - we need to update props now
export const updateCompState = (newState, blob) => {
  const { comps, stateAttributes, oldState, initialized, nue, getArray, getClosure, propsUsingIndex } = blob
  if (!comps.length || !initialized) return

  // update props which are using index
  comps.forEach((comp, i) => {
    propsUsingIndex.forEach(prop => {
      const { $ } = comp.nue
      if ($[prop] !== i) $[prop] = i
    })
  })

  const diffIndexes = arrayDiff(newState.values, oldState.values)
  // for each component whose state has updated
  diffIndexes.forEach(i => {
    // update props
    stateAttributes.forEach(attribute => {
      const [propValue, propName] = attribute
      const arr = getArray()
      const closure = getClosure(arr[i], i)
      comps[i].nue.$[propName] = propValue.getValue(nue, closure)
    })
  })
}
