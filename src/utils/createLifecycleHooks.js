import { addDeps } from './state/addDep.js'
import errors from './dev/errors.js'
import DEV from './dev/DEV.js'

function createLifecycleHooks (comp) {
  comp.on = {
    mount: (cb) => comp.mountCbs.push(cb),
    destroy: (cb) => comp.destroyCbs.push(cb),
    beforeUpdate: (cb) => comp.beforeUpdateCbs.push(cb),
    afterUpdate: (cb) => comp.afterUpdateCbs.push(cb),
    mutate: (cb, ...slices) => {
      if (DEV) {
        if (!slices.length) {
          errors.MISSING_DEPENDENCIES_IN_ON_MUTATE(comp)
        }
      }

      const deps = slices.map(slice => slice.split('.'))
      addDeps(comp, deps, cb, 'computed')
    }
  }
}

export default createLifecycleHooks
