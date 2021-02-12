// import { render } from '../../../index.js'
import { attr, saveOffsets } from '../../node/dom.js'
// import DEV from '../../dev/DEV.js'
import addDep from '../../state/addDep.js'
import { uid } from '../../others.js'
import { getNewState, updateCompState } from './utils/state.js'
import animateEnter from './animate/animateEnter.js'
import animateMove from './animate/animateMove.js'
import animateRemove from './animate/animateRemove.js'
import init from './utils/init.js'
import executeSteps from './executeSteps/executeSteps.js'
import reconcile from './diff/reconcile.js'
import deepClone from '../../deepClone.js'
import defineComponent from '../../defineComponent.js'
import dashify from '../../string/dashify.js'

function processFor (comp, forNode) {
  const forInfo = forNode.parsed.for
  const name = dashify(forNode.parsed.name)
  console.log(name, forNode.parsed)

  const blob = {
    comps: [],
    oldState: {},
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
    init(blob)
    forNode.before(document.createComment(' / FOR '))
    forNode.remove()
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
