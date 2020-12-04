import add_slice_dependency from './slice/add_slice_dependency.js'
import { memoize_cb } from './callbacks.js'

function update (fn, deps, type, batching = true) {
  fn.lifecycle = type
  if (!deps) {
    throw new Error(`No Dependency array given in ${fn.name}`)
    // this.stateDeps.$[type].push(fn)
  }
  else {
    const cb = batching ? memoize_cb.call(this, fn, type) : fn
    deps.forEach(d => {
      add_slice_dependency.call(this, d.split('.'), cb, type)
    })
  }
}

function add_lifecycle_hooks () {
  this.on = {
    add: (fn) => this.add_callbacks.push(fn),
    remove: (fn) => this.remove_callbacks.push(fn),
    beforeUpdate: (fn, deps) => update.call(this, fn, deps, 'before'),
    reactiveUpdate: (fn, deps) => update.call(this, fn, deps, 'reactive', false),
    afterUpdate: (fn, deps) => update.call(this, fn, deps, 'after', this),
    domUpdate: (fn, deps) => update.call(this, fn, deps, 'dom', this)
  }
}

export default add_lifecycle_hooks
