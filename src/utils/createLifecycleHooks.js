import addDep from './slice/addDep.js'

function createLifecycleHooks () {
  this.on = {
    mount: (cb) => this.mountCbs.push(cb),
    destroy: (cb) => this.destroyCbs.push(cb),
    beforeUpdate: (cb) => this.beforeUpdateCbs.push(cb),
    afterUpdate: (cb) => this.afterUpdateCbs.push(cb),
    mutate: (dep, cb) => {
      addDep.call(this, dep.split('.'), cb, 'computed')
    }
  }
}

export default createLifecycleHooks
