import onStateChange from './reactivity/onStateChange.js'

function update (fn, deps, type) {
  if (!deps) this.stateDeps.$.push(fn)
  else {
    deps.forEach(d => {
      onStateChange.call(this, d.split('.'), fn, type)
    })
  }
}

function addLifeCycles () {
  this.on = {
    add: (fn) => this.onAddCbs.push(fn),
    remove: (fn) => this.onRemoveCbs.push(fn),
    beforeUpdate: (fn, deps) => update.call(this, fn, deps, 'before'),
    afterUpdate: (fn, deps) => update.call(this, fn, deps, 'after', this)
  }
}

export default addLifeCycles
