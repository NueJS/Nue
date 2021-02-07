import { addDeps } from './state/addDep.js'
import errors from './dev/errors.js'
import DEV from './dev/DEV.js'

function createLifecycleHooks (comp) {
  comp.lifecycles = {
    onMount: (cb) => comp.mountCbs.push(cb),
    onDestroy: (cb) => comp.destroyCbs.push(cb),
    beforeUpdate: (cb) => comp.beforeUpdateCbs.push(cb),
    afterUpdate: (cb) => comp.afterUpdateCbs.push(cb),
    onMutate: (cb, ...slices) => {
      if (DEV && !slices.length) {
        errors.MISSING_DEPENDENCIES_IN_ON_MUTATE(comp)
      }
      // add the state dependency after the component is mounted
      comp.mountCbs.push(() => {
        const deps = slices.map(slice => slice.split('.'))
        addDeps(comp, deps, cb, 'computed')
      })
    }
  }
}

export default createLifecycleHooks
