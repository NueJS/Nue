// import { render } from '../../../index.js'
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
// import { registerComp } from './utils/comp.js'
import init from './utils/init.js'
import executeSteps from './executeSteps/executeSteps.js'
import reconcile from './diff/reconcile.js'
import deepClone from '../../deepClone.js'
import checkUniquenessOfKeys from './dev/checkUniquenessOfKeys.js'
import defineComponent from '../../defineComponent.js'

function processFor (comp, forNode) {
  const name = 'swt-' + uid()
  const forInfo = getForInfo(forNode)

  const blob = {
    comps: [],
    oldState: {},
    anchorNode: null,
    forInfo,
    name,
    forNode,
    comp: comp,
    deferred: [],
    createdComps: [],
    removedComps: [],
    animating: false,
    movedIndexes: [],
    // $index: forInfo.at.content,
    $each: forInfo.each.content
  }

  if (forInfo.at) {
    blob.$index = forInfo.at.content
  }

  if (DEV) checkForInfo(blob)

  const loopComp = o => o.template(forNode.innerHTML)
  defineComponent(name, loopComp)

  comp.deferred.push(() => {
    blob.anchorNode = document.createComment('for')
    forNode.before(blob.anchorNode)
    init(blob)
    forNode.before(document.createComment('/for'))
    forNode.remove()
  })

  const handleArrayChange = () => {
    const { comps, forInfo, oldState } = blob

    // get the new state - using the forInfo and comp
    const newState = getNewState(forInfo, comp)

    // check that no two hash are same
    if (DEV) {
      checkUniquenessOfKeys(comp, newState.hash)
    }

    // reconcile using the oldState and newState
    const steps = reconcile(oldState, newState)

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

  // @TODO use addDeps here instead ?
  addDep(comp, forInfo.of.deps[0], handleArrayChange, 'dom')
}

export default processFor
