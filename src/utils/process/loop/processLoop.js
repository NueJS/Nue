import addDep from '../../state/addDep.js'
import { getNewState, updateCompState } from './utils/state.js'
import animateEnter from './animate/animateEnter.js'
import animateMove from './animate/animateMove.js'
import animateRemove from './animate/animateRemove.js'
import executeSteps from './executeSteps/executeSteps.js'
import reconcile from './diff/reconcile.js'
import deepClone from '../../deepClone.js'
import { saveOffsets } from './animate/offset.js'
import { createComment } from '../../node/dom.js'

function processLoop (comp, loopedComp) {
  const forInfo = loopedComp.parsed.for
  const { map, reorder, at, as, key } = forInfo

  const getClosure = (value, index) => ({ [at]: index, [as]: value })
  const getArray = () => map.getValue(comp)
  const getKey = (value, index) => key.getValue(comp, getClosure(value, index))
  const getKeys = () => getArray().map(getKey)
  const attributes = loopedComp.parsed.attributes

  const propsUsingIndex = []
  // find props that are using indexes
  attributes.forEach(attr => {
    if (attr.placeholder.deps.some(dep => dep[0] === at)) {
      propsUsingIndex.push(attr.name)
    }
  })

  const blob = {
    propsUsingIndex,
    comps: [],
    oldState: { values: [], keys: [], keyHash: {} },
    anchorNode: null,
    attributes,
    ...forInfo,
    loopedComp,
    getArray,
    getClosure,
    getKeys,
    comp,
    deferred: [],
    createdComps: [],
    removedComps: [],
    movedIndexes: []
  }

  comp.deferred.push(() => {
    blob.anchorNode = createComment('loop')
    loopedComp.before(blob.anchorNode)
    loopedComp.before(createComment('/loop'))
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
  addDep(comp, map.deps[0], handleArrayChange, 'dom')
}

export default processLoop
