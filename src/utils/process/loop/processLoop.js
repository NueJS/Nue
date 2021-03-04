import subscribe from '../../subscription/subscribe.js'
import { createComment } from '../../node/dom.js'
import { DOM_BATCH, DEFERRED_WORK } from '../../constants.js'
import handleArrayChange from './utils/handleArrayChange.js'
import { arraysAreShallowEqual } from '../../others.js'
import getPartialMutationInfo from './utils/getPartialMutationInfo.js'
import zeroToNArray from './utils/zeroToNArray.js'

const processLoop = (compNode, loopedComp, parsed) => {
  const forInfo = parsed.for
  const { map, at, as, key } = forInfo

  const getClosure = (value, index) => ({ [at]: index, [as]: value })
  const getArray = () => map.getValue(compNode)
  const getKey = (value, index) => key.getValue(compNode, getClosure(value, index))
  const getKeys = () => getArray().map(getKey)

  const arrayPath = map.deps[0]
  const arrayPathString = arrayPath.join('.')
  const anchorNode = createComment('loop/')

  const oldState = { values: [], keys: [], keyHash: {} }
  const blob = {
    comps: [],
    anchorNode,
    ...forInfo,
    loopedComp,
    getArray,
    getClosure,
    getKeys,
    compNode
  }

  const fullReconcile = () => {
    const n = getArray().length
    handleArrayChange(blob, zeroToNArray(n), {}, oldState)
  }

  compNode[DEFERRED_WORK].push(() => {
    loopedComp.before(anchorNode)
    loopedComp.before(createComment('/loop'))
    loopedComp.remove()
    fullReconcile()
    blob.initialized = true
  })

  subscribe(compNode, arrayPath, (mutations) => {
    // if some mutation in batch assigned a new array
    const newArrayAssigned = mutations.some(mutation => arraysAreShallowEqual(mutation.path, arrayPath))
    if (newArrayAssigned) fullReconcile()
    else {
      // partial reconciliation
      const [dirtyIndexes, stateUpdatePaths] = getPartialMutationInfo(mutations, arrayPathString, arrayPath)
      handleArrayChange(blob, dirtyIndexes, stateUpdatePaths, oldState)
    }
  }, DOM_BATCH)
}

export default processLoop
