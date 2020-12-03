import onStateChange from './reactivity/onStateChange.js'
import { callCbOnce } from './reactivity/cbs.js'

function update (fn, deps, type, batching = true) {
  fn.lifecycle = type
  if (!deps) {
    throw new Error(`No Dependency array given in ${fn.name}`)
    // this.stateDeps.$[type].push(fn)
  }
  else {
    const cb = batching ? callCbOnce.call(this, fn, type) : fn
    deps.forEach(d => {
      onStateChange.call(this, d.split('.'), cb, type)
    })
  }
}

function addLifeCycles () {
  this.on = {
    add: (fn) => this.onAddCbs.push(fn),
    remove: (fn) => this.onRemoveCbs.push(fn),
    beforeUpdate: (fn, deps) => update.call(this, fn, deps, 'before'),
    reactiveUpdate: (fn, deps) => update.call(this, fn, deps, 'reactive', false),
    afterUpdate: (fn, deps) => update.call(this, fn, deps, 'after', this),
    domUpdate: (fn, deps) => update.call(this, fn, deps, 'dom', this)
  }
}

export default addLifeCycles
