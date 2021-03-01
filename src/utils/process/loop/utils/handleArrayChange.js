import animateEnter from '../animate/animateEnter'
import animateMove from '../animate/animateMove'
import animateRemove from '../animate/animateRemove'
import { saveOffsets } from '../animate/offset'
import reconcile from './reconcile'
import executeSteps from '../executeSteps/executeSteps'
import getNewState from './getNewState'
import updateCompsState from './updateCompsState'

const handleArrayChange = (blob, dirtyIndexes, stateUpdatedIndexes, indexAttributes, stateAttributes, oldState) => {
  const { comps, initialized, reorder } = blob
  const newState = getNewState(blob)

  // if nodes are added, removed or swapped
  if (dirtyIndexes.length) {
    const steps = reconcile(oldState, newState, dirtyIndexes)

    // record offsets before DOM is updated
    if (initialized && reorder) {
      saveOffsets(dirtyIndexes, comps, 'prevOffset')
    }

    // update DOM
    executeSteps(steps, blob)

    // record offsets after DOM is updated
    if (initialized && reorder) {
      saveOffsets(dirtyIndexes, comps, 'afterOffset')
    }

    if (initialized) {
      // update state attributes of components that are using indexes
      updateCompsState(blob, dirtyIndexes, indexAttributes)

      // run animations, if anu
      animateRemove([blob, dirtyIndexes]).then(animateMove).then(animateEnter)
    }
  }

  // if some component's state is updated
  if (stateUpdatedIndexes.length && initialized) {
    updateCompsState(blob, stateUpdatedIndexes, stateAttributes)
  }

  // save newState as oldState
  // only shallow clone required because we only care about indexes of oldState, not the deeply nested value
  oldState.values = [...newState.values]
  oldState.keys = newState.keys
  oldState.keyHash = newState.keyHash
}

export default handleArrayChange
