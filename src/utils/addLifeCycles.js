import onStateChange from './reactivity/onStateChange.js'

function addLifeCycles () {
  this.on = {
    add: (fn) => this.onAddCbs.push(fn),
    remove: (fn) => this.onRemoveCbs.push(fn),
    update: (fn, deps) => {
      if (!deps) {
        this.stateDeps.$.push(fn)
      }
      else {
        deps.forEach(d => {
          onStateChange.call(this, d.split('.'), fn)
        })
      }
    }
  }
}

export default addLifeCycles
