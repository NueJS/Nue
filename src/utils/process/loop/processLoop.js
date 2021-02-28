import subscribe from '../../state/subscribe.js'
import { createComment } from '../../node/dom.js'
import { DOM_BATCH, STATE } from '../../constants.js'
import handleArrayChange from './utils/handleArrayChange.js'
import zeroToNSet from './utils/zeroToNSet.js'
import { arraysAreShallowEqual } from '../../others.js'
import getPartialMutationInfo from './utils/getPartialMutationInfo.js'

const processLoop = (nue, loopedComp, parsed) => {
  const { attributes } = parsed
  const forInfo = parsed.for
  const { map, at, as, key } = forInfo

  const getClosure = (value, index) => ({ [at]: index, [as]: value })
  const getArray = () => map.getValue(nue)
  const getKey = (value, index) => key.getValue(nue, getClosure(value, index))
  const getKeys = () => getArray().map(getKey)

  // get state attributes
  const stateAttributes = attributes.filter(at => at[2] === STATE)
  // find attributes that depends on index
  const indexAttributes = stateAttributes.filter(attribute => {
    return attribute[0].deps.some(dep => dep[0] === at)
  })

  const arrayPath = map.deps[0]
  const arrayPathString = arrayPath.join('.')
  const anchorNode = createComment('---')

  const blob = {
    comps: [],
    oldState: { values: [], keys: [], keyHash: {} },
    attributes,
    anchorNode,
    stateAttributes,
    indexAttributes,
    ...forInfo,
    loopedComp,
    getArray,
    getClosure,
    getKeys,
    nue,
    deferred: [],
    createdComps: [],
    removedComps: [],
    movedIndexes: []
  }

  nue.deferred.push(() => {
    loopedComp.before(anchorNode)
    loopedComp.before(createComment('---'))
    loopedComp.remove()
    const n = getArray().length
    handleArrayChange(blob, zeroToNSet(n), zeroToNSet(n), indexAttributes, stateAttributes)
    blob.initialized = true
  })

  subscribe(nue, arrayPath, (mutations) => {
    // if some mutation in batch assigned a new array
    const newArrayAssigned = mutations.some(mutation => arraysAreShallowEqual(mutation.path, arrayPath))
    if (newArrayAssigned) {
      // full reconciliation
      const n = getArray().length
      handleArrayChange(blob, zeroToNSet(n), zeroToNSet(n), indexAttributes, stateAttributes)
    } else {
      // partial reconciliation
      const [dirtyIndexes, stateUpdatedIndexes] = getPartialMutationInfo(mutations, arrayPathString, arrayPath)
      handleArrayChange(blob, dirtyIndexes, stateUpdatedIndexes, indexAttributes, stateAttributes)
    }
  }, DOM_BATCH)
}

export default processLoop
