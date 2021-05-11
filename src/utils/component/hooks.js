import { subscribeMultiple } from '../subscription/subscribe.js'
import { errors } from '../dev/errors/index.js'

/**
 * add lifecycle hooks to comp
 * @param {Comp} comp
 */
export const addHooks = (comp) => {
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
        throw errors.missing_dependency_array_in_onMutate(comp)
      }

      _onMount.push(() => {
        const stateDeps = slices.map(slice => slice.split('.'))
        return subscribeMultiple(comp, stateDeps, cb, 0)
      })
    }
  }
}
