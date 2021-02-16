import { saveOffsets } from '../../node/dom.js'
import addDep from '../../state/addDep.js'
import { getNewState, updateCompState } from './utils/state.js'
import animateEnter from './animate/animateEnter.js'
import animateMove from './animate/animateMove.js'
import animateRemove from './animate/animateRemove.js'
import executeSteps from './executeSteps/executeSteps.js'
import reconcile from './diff/reconcile.js'
import deepClone from '../../deepClone.js'
import dashify from '../../string/dashify.js'

function processFor (comp, forNode) {
  const forInfo = forNode.parsed.for
  const name = dashify(forNode.parsed.name)

  const blob = {
    comps: [],
    oldState: { value: [], hash: [] },
    anchorNode: null,
    forInfo,
    forNode,
    comp,
    name,
    deferred: [],
    // to keep track of what new components add or removed
    createdComps: [],
    removedComps: [],
    movedIndexes: []
  }

  comp.deferred.push(() => {
    blob.anchorNode = document.createComment(' FOR ')
    // add anchorNode before forNode
    forNode.before(blob.anchorNode)

    forNode.before(document.createComment(' / FOR '))
    forNode.remove()
    handleArrayChange()
    blob.initialized = true
  })

  const handleArrayChange = () => {
    const { comps, forInfo, oldState } = blob
    const newState = getNewState(forInfo, comp)
    const steps = reconcile(oldState, newState)
    if (forInfo.reorder) saveOffsets(comps)
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

export default processFor
