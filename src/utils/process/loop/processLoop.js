import subscribe from '../../subscription/subscribe.js'
import { createComment } from '../../node/dom.js'
import { DOM_BATCH, DEFERRED_WORK } from '../../constants.js'
import handleArrayChange from './utils/handleArrayChange.js'
import { arraysAreShallowEqual } from '../../others.js'
import getPartialMutationInfo from './utils/getPartialMutationInfo.js'
import zeroToNArray from './utils/zeroToNArray.js'

/**
 *
 * @param {import('../../types.js').compNode} compNode
 * @param {import('../../types.js').compNode} loopedComp
 * @param {import('../../types.js').parsedInfo} parsed
 */
const processLoop = (compNode, loopedComp, parsed) => {
  /** @type {import('../../types.js').forInfo} */
  // @ts-ignore
  const forInfo = parsed.for
  const { itemArray, itemIndex, item, key } = forInfo

  /**
   * return the closure containing value and index
   * @param {any} value
   * @param {number} index
   * @returns {Record<string, any>}
   */

  const getClosure = (value, index) => ({
    // @ts-ignore
    [itemIndex]: index,
    [item]: value
  })

  /**  @returns {Array<any>} */
  // @ts-ignore
  const getArray = () => itemArray.getValue(compNode)

  /**
   * return the value of key using the closure information
   * @param {any} value
   * @param {number} index
   * @returns {any}
   */
  // @ts-ignore
  const getKey = (value, index) => key.getValue({ name: parsed.name, $: getClosure(value, index) })

  const getKeys = () => getArray().map(getKey)

  // @ts-ignore
  const arrayPath = itemArray.deps[0]
  const arrayPathString = arrayPath.join('.')
  const anchorNode = createComment('loop/')

  const oldState = { values: [], keys: [], keyHash: {} }

  /** @type {import('../../types.js').loopInfo} */
  const blob = {
    comps: [],
    anchorNode,
    ...forInfo,
    loopedComp,
    getArray,
    getClosure,
    getKeys,
    compNode,
    initialized: false
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

  /** @type {import('../../types.js').subscribeCallback} */
  const onDepsChange = (batchInfoArray) => {
    // if some mutation in batch assigned a new array
    const newArrayAssigned = batchInfoArray.some(batchInfo => arraysAreShallowEqual(batchInfo.path, arrayPath))
    if (newArrayAssigned) fullReconcile()
    else {
      // partial reconciliation
      const [dirtyIndexes, stateUpdatePaths] = getPartialMutationInfo(batchInfoArray, arrayPathString, arrayPath)
      handleArrayChange(blob, dirtyIndexes, stateUpdatePaths, oldState)
    }
  }

  subscribe(compNode, arrayPath, onDepsChange, DOM_BATCH)
}

export default processLoop
