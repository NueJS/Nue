import { saveOffsets } from '../animate/offset'
import reconcile from './reconcile'
import executeSteps from '../executeSteps/executeSteps'
import getNewState from './getNewState'
import { animateAll } from '../../../node/dom'
import animateMove from '../animate/animateMove'
import { targetProp } from '../../../state/slice'

/**
 *
 * @param {import('../../../types').loopInfo} blob
 * @param {Array<number>} dirtyIndexes
 * @param {import('../../../types').stateUpdates} stateUpdates
 * @param {import('../../../types').loopState} oldState
 */
const handleArrayChange = (blob, dirtyIndexes, stateUpdates, oldState) => {
  const { comps, initialized, reorder, exit, itemIndex, item } = blob
  const updatedStateKeys = Object.keys(stateUpdates)

  const updateStates = () => {
    if (!updatedStateKeys.length) return
    updatedStateKeys.forEach(index => {
      const i = Number(index)
      const comp = comps[i]
      if (comp) {
        stateUpdates[i].forEach(info => {
          const [target, prop] = targetProp(comp.$[item], info.path)
          target[prop] = info.newValue
        })
      }
    })
  }

  const handleDirtyIndexes = () => {
    const newState = getNewState(blob)
    const steps = reconcile(oldState, newState, dirtyIndexes)

    // if reorder animation is to be played, record offsets before DOM is updated
    if (reorder && initialized) saveOffsets(dirtyIndexes, comps)

    const updateIndexes = () => {
      // if index is used, only then update the indexes
      if (itemIndex) {
        dirtyIndexes.forEach(i => {
          if (comps[i]) comps[i].$[itemIndex] = i
        })
      }
    }

    const executeAndMove = () => {
      // Note: update states must happen after executeSteps

      // update DOM
      executeSteps(steps, blob)

      if (initialized) {
        updateIndexes()
        updateStates()
      }

      if (reorder) animateMove(blob, dirtyIndexes)
    }

    // if exit animations are specified and we have to remove some nodes, run exit animations
    // else directly call executeAndMove
    if (exit && steps.remove.length) {
      // to get actual index valueIndex, arrayIndex need to be added
      const nodes = steps.remove.map((valueIndex, arrayIndex) => comps[valueIndex + arrayIndex])
      animateAll(nodes, exit, executeAndMove)
    } else executeAndMove()
    // ---------------------

    // save newState as oldState
    oldState.values = [...newState.values] // only shallow clone required because we only care about indexes of oldState, not the deeply nested value
    oldState.keys = newState.keys
    oldState.keyHash = newState.keyHash
  }

  dirtyIndexes.length ? handleDirtyIndexes() : updateStates()
}

export default handleArrayChange
