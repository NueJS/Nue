import { saveOffsets } from '../../node/dom.js'
import addDep from '../../state/addDep.js'
import { getNewState, updateCompState } from './utils/state.js'
import animateEnter from './animate/animateEnter.js'
import animateMove from './animate/animateMove.js'
import animateRemove from './animate/animateRemove.js'
import executeSteps from './executeSteps/executeSteps.js'
import reconcile from './diff/reconcile.js'
import deepClone from '../../deepClone.js'

function processLoop (comp, loopedComp) {
  const forInfo = loopedComp.parsed.for
  const { map, reorder, at, as, key } = forInfo

  const getClosure = (value, index) => ({
    [at]: index,
    [as]: value
  })

  const getArray = () => map.getValue(comp.$)

  const getKeys = () => getArray().map((value, index) => key.getValue(comp.$, getClosure(value, index)))

  const blob = {
    comps: [],
    oldState: { value: [], hash: [] },
    anchorNode: null,
    attributes: loopedComp.parsed.attributes,
    forInfo,
    loopedComp,
    getArray,
    getClosure,
    getKeys,
    comp,
    name: loopedComp.parsed.dashName,
    deferred: [],
    // to keep track of what new components add or removed
    createdComps: [],
    removedComps: [],
    movedIndexes: []
  }

  comp.deferred.push(() => {
    blob.anchorNode = document.createComment(' FOR ')
    // add anchorNode before loopedComp
    loopedComp.before(blob.anchorNode)

    loopedComp.before(document.createComment(' / FOR '))
    loopedComp.remove()
    handleArrayChange()
    blob.initialized = true
  })

  const handleArrayChange = () => {
    const { comps, oldState } = blob
    const newState = getNewState(blob)
    const steps = reconcile(oldState, newState)

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
  addDep(comp, forInfo.map.deps[0], handleArrayChange, 'dom')
}

export default processLoop
