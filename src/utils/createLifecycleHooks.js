import addDep from './state/addDep.js'

function createLifecycleHooks () {
  this.on = {
    mount: (cb) => this.mountCbs.push(cb),
    destroy: (cb) => this.destroyCbs.push(cb),
    beforeUpdate: (cb) => this.beforeUpdateCbs.push(cb),
    afterUpdate: (cb) => this.afterUpdateCbs.push(cb),
    mutate: (cb, ...deps) => {
      deps.forEach(dep => {
        addDep.call(this, dep.split('.'), cb, 'computed')
      })
    }
  }
}

export default createLifecycleHooks
