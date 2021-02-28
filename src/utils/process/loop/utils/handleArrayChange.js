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
  if (dirtyIndexes.size) {
    const steps = reconcile(oldState, newState, dirtyIndexes)
    // to show reorder animation - we have to save offsets before updating nodes
    if (reorder) saveOffsets(comps)
    // add, remove and move the components
    executeSteps(steps, blob)
    // if there are any kind of animations specified, run them in this order
    animateRemove(blob).then(animateMove).then(animateEnter)

    // update indexes
    if (initialized) {
      updateCompsState(blob, dirtyIndexes, indexAttributes)
    }
  }

  // if some component's state is updated
  if (stateUpdatedIndexes.size && initialized) {
    updateCompsState(blob, stateUpdatedIndexes, stateAttributes)
  }

  // save newState as oldState
  // only shallow clone required because we only care about indexes of oldState, not the deeply nested value
  oldState.values = [...newState.values]
  oldState.keys = newState.keys
  oldState.keyHash = newState.keyHash
}

export default handleArrayChange
