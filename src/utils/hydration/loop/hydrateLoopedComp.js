import { subscribe } from '../../subscription/subscribe.js'
import { createComment } from '../../node/dom.js'
import { handleArrayChange } from './utils/handleArrayChange.js'
import { arraysAreShallowEqual } from '../../others.js'
import { getArrayMutationInfo } from './utils/getArrayMutationInfo.js'
import { zeroToNArray } from './utils/zeroToNArray.js'
import { batches } from 'enums.js'

/**
 * hydrate looped comp
 * @param {import('types/dom').LoopedComp} loopedComp
 * @param {import('types/dom').Comp} parentComp
 */
export const hydrateLoopedComp = (loopedComp, parentComp) => {
  const parsed = loopedComp._parsedInfo

  const loopAttributes = parsed._loopAttributes
  const { _itemArray, _itemIndex, _item, _key } = loopAttributes

  /**
   * return the closure containing value and index
   * @param {any} value
   * @param {number} index
   * @returns {Record<string, any>}
   */

  const getClosure = (value, index) => {
    const closure = {
      [_item]: value
    }

    if (_itemIndex) closure[_itemIndex] = index
    return closure
  }

  /** @returns {Array<any>} */
  const getArray = () => _itemArray._getValue(loopedComp.$, loopedComp._compFnName)

  /**
   * return the value of key using the closure information
   * @param {any} value
   * @param {number} index
   * @returns {any}
   */

  // @todo current key can only be from closure, add support for state too
  const getKey = (value, index) => _key._getValue(getClosure(value, index), loopedComp._compFnName)

  const getKeys = () => getArray().map(getKey)

  // @ts-ignore
  const arrayPath = _itemArray.deps[0]
  const arrayPathString = arrayPath.join('.')
  const anchor = createComment('loop/')

  const oldState = { _values: [], _keys: [], _keyHash: {} }

  /** @type {import('types/loop').LoopInfo} */
  const loopInfo = {
    _loopedCompInstances: [],
    _anchor: anchor,
    _loopedComp: loopedComp,
    _getArray: getArray,
    _getClosure: getClosure,
    _getKeys: getKeys,
    _parentComp: parentComp,
    _instanciated: false,
    _loopAttributes: loopAttributes,
    _animation: parsed._animationAttributes
  }

  const fullReconcile = () => {
    const n = getArray().length
    handleArrayChange(loopInfo, zeroToNArray(n), {}, oldState)
  }

  parentComp._deferredWork.push(() => {
    loopedComp.before(anchor)
    loopedComp.before(createComment('/loop'))
    loopedComp.remove()
    fullReconcile()
    loopInfo._instanciated = true
  })

  /** @type {import('types/subscription').SubCallBack} */
  const onDepsChange = (mutations) => {
    // if some mutation in batch assigned a new array
    const newArrayAssigned = mutations.some(batchInfo => arraysAreShallowEqual(batchInfo.path, arrayPath))
    if (newArrayAssigned) fullReconcile()
    else {
      // partial reconciliation
      const [dirtyIndexes, stateUpdatePaths] = getArrayMutationInfo(mutations, arrayPathString, arrayPath)
      handleArrayChange(loopInfo, dirtyIndexes, stateUpdatePaths, oldState)
    }
  }

  subscribe(parentComp, arrayPath, onDepsChange, batches._DOM)
}
