import { addDeps } from './state/addDep.js'
import errors from './dev/errors.js'
import DEV from './dev/DEV.js'

export const runEvent = (comp, name) => comp.cbs[name].forEach(cb => cb())

function addLifecycles (comp) {
  const onMount = []
  const onDestroy = []
  const beforeUpdate = []
  const afterUpdate = []

  comp.cbs = { onMount, onDestroy, beforeUpdate, afterUpdate }

  comp.events = {
    onMount: (cb) => onMount.push(cb),
    onDestroy: (cb) => onDestroy.push(cb),
    beforeUpdate: (cb) => beforeUpdate.push(cb),
    afterUpdate: (cb) => afterUpdate.push(cb),
    onMutate: (cb, ...slices) => {
      if (DEV && !slices.length) {
        errors.MISSING_DEPENDENCIES_IN_ON_MUTATE(comp)
      }
      // add the state dependency after the component is mounted
      onMount.push(() => {
        const deps = slices.map(slice => slice.split('.'))
        addDeps(comp, deps, cb, 'computed')
      })
    }
  }
}

export default addLifecycles
