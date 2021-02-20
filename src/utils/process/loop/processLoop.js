import addDep from '../../state/addDep.js'
import { getNewState, updateCompState } from './utils/state.js'
import animateEnter from './animate/animateEnter.js'
import animateMove from './animate/animateMove.js'
import animateRemove from './animate/animateRemove.js'
import executeSteps from './executeSteps/executeSteps.js'
import reconcile from './diff/reconcile.js'
import deepClone from '../../deepClone.js'
import { saveOffsets } from './animate/offset.js'

function processLoop (comp, loopedComp) {
  const forInfo = loopedComp.parsed.for
  const { map, reorder, at, as, key } = forInfo

  const getClosure = (value, index) => ({ [at]: index, [as]: value })
  const getArray = () => map.getValue(comp.$)
  const getKey = (value, index) => key.getValue(comp.$, getClosure(value, index))
  const getKeys = () => getArray().map(getKey)

  const blob = {
    comps: [],
    oldState: { value: [], hash: [] },
    anchorNode: null,
    attributes: loopedComp.parsed.attributes,
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
    blob.anchorNode = document.createComment('loop')
    loopedComp.before(blob.anchorNode)
    loopedComp.before(document.createComment('/loop'))
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
    oldState.value = deepClone(newState.value)
    oldState.hash = newState.hash
  }

  // @TODO use addDeps here instead ?
  addDep(comp, map.deps[0], handleArrayChange, 'dom')
}

export default processLoop
