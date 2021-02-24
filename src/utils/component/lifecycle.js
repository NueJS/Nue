import { addDeps } from '../state/subscribe.js'
import errors from '../dev/errors.js'
import DEV from '../dev/DEV.js'

export const runEvent = (nue, name) => nue.cbs[name].forEach(cb => cb())

function addLifecycles (nue) {
  nue.cbs = { onMount: [], onDestroy: [], beforeUpdate: [], afterUpdate: [] }
  const { onMount, onDestroy, beforeUpdate, afterUpdate } = nue.cbs

  nue.events = {
    onMount: (cb) => onMount.push(cb),
    onDestroy: (cb) => onDestroy.push(cb),
    beforeUpdate: (cb) => beforeUpdate.push(cb),
    afterUpdate: (cb) => afterUpdate.push(cb),
    onMutate: (cb, ...slices) => {
      if (DEV && !slices.length) {
        throw errors.MISSING_DEPENDENCIES_IN_ON_MUTATE(nue.name)
      }
      // add the state dependency after the component is mounted
      onMount.push(() => {
        const deps = slices.map(slice => slice.split('.'))
        addDeps(nue, deps, cb, 'computed')
      })
    }
  }
}

export default addLifecycles
