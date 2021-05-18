import { subscribeMultiple } from '../subscription/subscribeMultiple'
import { errors } from '../dev/errors/index.js'
import { batches } from '../enums'

/**
 * add events api on comp
 * @param {Comp} comp
 */

export const addEvents = (comp) => {
  comp._eventCbs = {
    _onMount: [],
    _onDestroy: [],
    _beforeUpdate: [],
    _afterUpdate: []
  }

  const { _onMount, _onDestroy, _beforeUpdate, _afterUpdate } = comp._eventCbs

  comp.events = {
    onMount: (cb) => _onMount.push(cb),
    onDestroy: (cb) => _onDestroy.push(cb),
    beforeUpdate: (cb) => _beforeUpdate.push(cb),
    afterUpdate: (cb) => _afterUpdate.push(cb),

    onMutate: (cb, slices) => {
      if (_DEV_ && !slices.length) {
        throw errors.missing_dependency_array_in_onMutate(comp._compName)
      }

      _onMount.push(() => {
        const stateDeps = slices.map(slice => slice.split('.'))
        return subscribeMultiple(stateDeps, comp, cb, batches._beforeDOM)
      })
    }
  }
}
