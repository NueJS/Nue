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
import errors from '../../dev/errors.js'

function processFor (self, forNode) {
  const compName = 'swt-' + uid()
  const forInfo = getForInfo(forNode)

  const blob = {
    comps: [],
    oldState: {},
    anchorNode: null,
    forInfo,
    compName,
    forNode,
    comp: self,
    deferred: [],
    createdComps: [],
    removedComps: [],
    animating: false,
    movedIndexes: [],
    $index: forInfo.at.content,
    $each: forInfo.each.content
  }

  if (DEV) checkForInfo(blob)

  registerComp(compName, forNode.innerHTML)

  self.deferred.push(() => {
    blob.anchorNode = document.createComment('for')
    forNode.before(blob.anchorNode)
    render(compName)
    init(blob)
    forNode.before(document.createComment('/for'))
    forNode.remove()
  })

  const isUniqueArray = (arr) => {
    const set = new Set(arr)
    return set.size === arr.length
  }

  const handleArrayChange = () => {
    console.log('array is changed')
    const { comps, forInfo, oldState } = blob

    // get the new state - using the forInfo and self
    const newState = getNewState(forInfo, self)

    // check that no two hash are same
    if (DEV) {
      const keys = newState.hash
      if (!isUniqueArray(newState.hash)) {
        errors.KEYS_ARE_NOT_UNIQUE(keys, self)
      }
    }

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

  addDep(self, forInfo.of.deps[0], handleArrayChange, 'dom')
}

export default processFor
