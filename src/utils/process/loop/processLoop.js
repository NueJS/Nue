import subscribe from '../../state/subscribe.js'
import { getNewState, updateCompState } from './utils/state.js'
import animateEnter from './animate/animateEnter.js'
import animateMove from './animate/animateMove.js'
import animateRemove from './animate/animateRemove.js'
import executeSteps from './executeSteps/executeSteps.js'
import reconcile from './diff/reconcile.js'
import deepClone from '../../deepClone.js'
import { saveOffsets } from './animate/offset.js'
import { createComment } from '../../node/dom.js'
import { DOM_BATCH, STATE } from '../../constants.js'

const processLoop = (nue, loopedComp, parsed) => {
  const { attributes } = parsed
  const forInfo = parsed.for
  const { map, reorder, at, as, key } = forInfo

  const getClosure = (value, index) => ({ [at]: index, [as]: value })
  const getArray = () => map.getValue(nue)
  const getKey = (value, index) => key.getValue(nue, getClosure(value, index))
  const getKeys = () => getArray().map(getKey)

  const stateAttributes = attributes.filter(at => at[2] === STATE)

  // find props that are using indexes
  const propsUsingIndex = stateAttributes.filter(attribute => {
    return attribute[0].deps.some(dep => dep[0] === at)
  })

  const blob = {
    propsUsingIndex,
    comps: [],
    oldState: { values: [], keys: [], keyHash: {} },
    anchorNode: null,
    attributes,
    stateAttributes,
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
    blob.anchorNode = createComment('---')
    loopedComp.before(blob.anchorNode)
    loopedComp.before(createComment('---'))
    loopedComp.remove()
    handleArrayChange()
    blob.initialized = true
  })

  const handleArrayChange = () => {
    const { comps, oldState } = blob
    const newState = getNewState(blob)
    const steps = reconcile(oldState, newState)

    // to show reorder animation - we have to save offsets before updating nodes
    if (reorder) saveOffsets(comps)

    // add, remove and move the components
    executeSteps(steps, blob)

    // update state of components if needed
    updateCompState(newState, blob)

    // if there are any kind of animations specified, run them in this order
    animateRemove(blob).then(animateMove).then(animateEnter)

    // save newState as oldState
    // @todo optimize this
    oldState.values = deepClone(newState.values)
    oldState.keys = newState.keys
    oldState.keyHash = newState.keyHash
  }

  // @TODO optimize this
  // handleArrayChange should be called only the entire array is mutated
  // else only update the state of exact item in array
  subscribe(nue, map.deps[0], handleArrayChange, DOM_BATCH)
}

export default processLoop
