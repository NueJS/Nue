import { addDeps } from './state/addDep.js'

function createLifecycleHooks () {
  this.on = {
    mount: (cb) => this.mountCbs.push(cb),
    destroy: (cb) => this.destroyCbs.push(cb),
    beforeUpdate: (cb) => this.beforeUpdateCbs.push(cb),
    afterUpdate: (cb) => this.afterUpdateCbs.push(cb),
    mutate: (cb, ...slices) => {
      if (!slices.length) throw new Error('on.mutate expects one or more dependencies')
      const deps = slices.map(slice => slice.split('.'))
      addDeps.call(this, deps, cb, 'computed')
    }
  }
}

export default createLifecycleHooks
