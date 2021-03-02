import { saveOffsets } from '../animate/offset'
import reconcile from './reconcile'
import executeSteps from '../executeSteps/executeSteps'
import getNewState from './getNewState'
import updateCompsState from './updateCompsState'
import { animateAll } from '../../../node/dom'
import animateMove from '../animate/animateMove'

const handleArrayChange = (blob, dirtyIndexes, stateUpdatedIndexes, indexAttributes, stateAttributes, oldState) => {
  const { comps, initialized, reorder, exit } = blob
  const newState = getNewState(blob)

  if (stateUpdatedIndexes.length && initialized) {
    updateCompsState(blob, stateUpdatedIndexes, stateAttributes)
  }

  // if nodes are added, removed or swapped
  if (dirtyIndexes.length) {
    const steps = reconcile(oldState, newState, dirtyIndexes)

    // record offsets before DOM is updated
    if (initialized && reorder) {
      saveOffsets(dirtyIndexes, comps)
    }

    const executeAndMove = () => {
      // update DOM
      executeSteps(steps, blob)
      // update state of components
      if (indexAttributes.length && initialized) {
        updateCompsState(blob, indexAttributes, stateAttributes)
      }
      // run move animations
      if (reorder) animateMove(blob, dirtyIndexes)
    }

    // if exit animations are specified and we have to remove some nodes, run exit animations
    // else directly call executeAndMove
    if (exit && steps.remove.length) {
      // to get actual index valueIndex, arrayIndex need to be added
      const nodes = steps.remove.map((valueIndex, arrayIndex) => comps[valueIndex + arrayIndex])
      animateAll(nodes, exit, executeAndMove)
    } else {
      executeAndMove()
    }
  }

  // save newState as oldState
  // only shallow clone required because we only care about indexes of oldState, not the deeply nested value
  oldState.values = [...newState.values]
  oldState.keys = newState.keys
  oldState.keyHash = newState.keyHash
}

export default handleArrayChange
