import { render } from '../../../index.js'
import { saveOffsets } from '../../node/dom.js'
import DEV from '../../dev/DEV.js'
import addDep from '../../state/addDep.js'
import { uid } from '../../others.js'
import { getNewState, updateCompState } from './utils/state.js'
import animateEnter from './animate/animateEnter.js'
import animateMove from './animate/animateMove.js'
import animateRemove from './animate/animateRemove.js'
import checkForInfo from './utils/checkForInfo.js'
import { getForInfo } from './utils/get.js'
import { registerComp } from './utils/comp.js'
import init from './utils/init.js'
import executeSteps from './executeSteps/executeSteps.js'
import reconcile from './diff/reconcile.js'
import deepClone from '../../deepClone.js'

function processFor (comp, forNode) {
  const compName = 'swt-' + uid()
  const forInfo = getForInfo(forNode)

  const blob = {
    comps: [],
    oldState: {},
    anchorNode: null,
    forInfo,
    compName,
    forNode,
    comp,
    deferred: [],
    createdComps: [],
    removedComps: [],
    animating: false,
    movedIndexes: [],
    $index: forInfo.at.content
  }

  if (DEV) checkForInfo(blob)

  registerComp(compName, forNode.innerHTML)

  comp.deferred.push(() => {
    blob.anchorNode = document.createComment('for')
    forNode.before(blob.anchorNode)
    render(compName)
    init(blob)
    forNode.before(document.createComment('/for'))
    forNode.remove()
  })

  const handleArrayChange = () => {
    const { comps, forInfo, oldState } = blob

    // get the new state - using the forInfo and comp
    const newState = getNewState(forInfo, comp)

    // reconcile using the oldState and newState
    const steps = reconcile(oldState, newState)

    console.log('steps', steps)

    if (forInfo.reorder) saveOffsets(comps)

    // add, remove and move the comps
    executeSteps(steps, blob)

    // update the state of comps
    if (comps.length) {
      updateCompState(newState, blob)
    }

    animateRemove(blob).then(animateMove).then(animateEnter)

    oldState.value = deepClone(newState.value)
    oldState.hash = newState.hash
  }

  addDep(comp, forInfo.of.deps[0], handleArrayChange, 'dom')
}

export default processFor
