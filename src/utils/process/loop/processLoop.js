import subscribe from '../../state/subscribe.js'
import { createComment } from '../../node/dom.js'
import { DOM_BATCH, STATE, NORMAL } from '../../constants.js'
import handleArrayChange from './utils/handleArrayChange.js'
import { arraysAreShallowEqual } from '../../others.js'
import getPartialMutationInfo from './utils/getPartialMutationInfo.js'
import zeroToNArray from './utils/zeroToNArray.js'

const processLoop = (nue, loopedComp, parsed) => {
  const { attributes } = parsed
  const forInfo = parsed.for
  const { map, at, as, key, enter, exit } = forInfo

  const getClosure = (value, index) => ({ [at]: index, [as]: value })
  const getArray = () => map.getValue(nue)
  const getKey = (value, index) => key.getValue(nue, getClosure(value, index))
  const getKeys = () => getArray().map(getKey)

  // get state attributes
  const stateAttributes = attributes.filter(at => at[2] === STATE || at[2] === NORMAL)

  // find attributes that depends on index
  const indexAttributes = stateAttributes.filter(attribute => {
    return attribute[0].deps.some(dep => dep[0] === at)
  })

  const arrayPath = map.deps[0]
  const arrayPathString = arrayPath.join('.')
  const anchorNode = createComment('---')

  const oldState = { values: [], keys: [], keyHash: {} }
  const blob = {
    comps: [],
    anchorNode,
    ...forInfo,
    loopedComp,
    getArray,
    getClosure,
    getKeys,
    nue
  }

  if (enter) blob.createdComps = []
  if (exit) blob.removedComps = []

  const fullReconcile = () => {
    const n = getArray().length
    handleArrayChange(blob, zeroToNArray(n), zeroToNArray(n), indexAttributes, stateAttributes, oldState)
  }

  nue.deferred.push(() => {
    loopedComp.before(anchorNode)
    loopedComp.before(createComment('---'))
    loopedComp.remove()
    fullReconcile()
    blob.initialized = true
  })

  subscribe(nue, arrayPath, (mutations) => {
    // if some mutation in batch assigned a new array
    const newArrayAssigned = mutations.some(mutation => arraysAreShallowEqual(mutation.path, arrayPath))
    if (newArrayAssigned) fullReconcile()
    else {
      // partial reconciliation
      const [dirtyIndexes, stateUpdatedIndexes] = getPartialMutationInfo(mutations, arrayPathString, arrayPath)
      handleArrayChange(blob, dirtyIndexes, stateUpdatedIndexes, indexAttributes, stateAttributes, oldState)
    }
  }, DOM_BATCH)
}

export default processLoop
