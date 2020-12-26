import { addDeps } from './state/addDep.js'
import err from './dev/error.js'
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
          err({
            message: 'on.mutate expects one or more dependencies',
            link: '',
            code: 2,
            comp
          })
        }
      }

      const deps = slices.map(slice => slice.split('.'))
      addDeps(comp, deps, cb, 'computed')
    }
  }
}

export default createLifecycleHooks
