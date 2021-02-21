import DEV from '../../../dev/DEV'
import { arrayToHash } from '../../../others'
import checkUniquenessOfKeys from '../dev/checkUniquenessOfKeys'
import arrayDiff from '../diff/arrayDiff'

export const getNewState = (blob) => {
  const { comp, getArray, getKeys } = blob
  const values = getArray()
  const keys = getKeys()
  const keyHash = arrayToHash(keys)
  if (DEV) checkUniquenessOfKeys(comp, keys)
  return {
    keys,
    values,
    keyHash
  }
}

// @todo - do not update index - we need to update props now
export const updateCompState = (newState, blob) => {
  const { comps, attributes, oldState, initialized, comp, getArray, getClosure, at, propsUsingIndex } = blob
  if (!comps.length || !initialized) return

  // update props which are using index
  comps.forEach((c, i) => {
    propsUsingIndex.forEach(prop => {
      if (comps[i].nue.$[prop] !== i) {
        comps[i].nue.$[prop] = i
      }
    })
  })

  const diffIndexes = arrayDiff(newState.values, oldState.values)
  // for each component whose state has updated
  diffIndexes.forEach(i => {
    // update props
    attributes.forEach(attribute => {
      const arr = getArray()
      const closure = getClosure(arr[i], i)
      comps[i].nue.$[attribute.name] = attribute.placeholder.getValue(comp.$, closure)
    })
  })
}
