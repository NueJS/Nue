import { saveOffsets } from '../animate/offset'
import { reconcile } from './reconcile'
import { executeSteps } from '../executeSteps/executeSteps'
import { getNewState } from './getNewState'
import { animateMove } from '../animate/animateMove'
import { animateAll } from '../../../dom/animate'
import { getTargetProp } from '../../../state/getTargetProp'

/**
 * update dom to reflect the array mutation
 * @param {LoopInfo} loopInfo
 * @param {number[]} dirtyIndexes
 * @param {UpdatedSlices} updatedSlices
 * @param {ReconcileState} oldState
 */
export const handleArrayChange = (loopInfo, dirtyIndexes, updatedSlices, oldState) => {
  const { _loopedCompInstances, _instanciated, _animation, _loopAttributes } = loopInfo
  const { _move, _exit } = _animation
  const { _item, _itemIndex } = _loopAttributes
  const updatedStateKeys = Object.keys(updatedSlices)

  const updateStates = () => {
    if (!updatedStateKeys.length) return
    updatedStateKeys.forEach(index => {
      const i = Number(index)
      const comp = _loopedCompInstances[i]
      if (comp) {
        updatedSlices[i].forEach(info => {
          const [target, prop] = getTargetProp(comp.$[_item], info._path)
          target[prop] = info._newValue
        })
      }
    })
  }

  const handleDirtyIndexes = () => {
    const newState = getNewState(loopInfo)
    const steps = reconcile(oldState, newState, dirtyIndexes)

    // if reorder animation is to be played, record offsets before DOM is updated
    if (_move && _instanciated) {
      saveOffsets(dirtyIndexes, _loopedCompInstances)
    }

    const updateIndexes = () => {
      // if index is used, only then update the indexes
      if (_itemIndex) {
        dirtyIndexes.forEach(i => {
          if (_loopedCompInstances[i]) _loopedCompInstances[i].$[_itemIndex] = i
        })
      }
    }

    const executeAndMove = () => {
      // Note: update states must happen after executeSteps

      // update DOM
      executeSteps(steps, loopInfo)

      if (_instanciated) {
        updateIndexes()
        updateStates()
      }

      if (_move && _instanciated) {
        animateMove(_loopedCompInstances, dirtyIndexes, _move)
      }
    }

    // if exit animations are specified and we have to remove some nodes, run exit animations
    // else directly call executeAndMove
    if (_exit && steps._remove.length) {
      // to get actual index valueIndex, arrayIndex need to be added
      const nodes = steps._remove.map((valueIndex, arrayIndex) => _loopedCompInstances[valueIndex + arrayIndex])
      animateAll(nodes, _exit, executeAndMove)
    } else executeAndMove()

    // save newState as oldState
    oldState._values = [...newState._values] // only shallow clone required because we only care about indexes of oldState, not the deeply nested value
    oldState._keys = newState._keys
    oldState._keyHash = newState._keyHash
  }

  dirtyIndexes.length ? handleDirtyIndexes() : updateStates()
}
