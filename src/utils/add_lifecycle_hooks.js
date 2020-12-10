import add_slice_dependency from './slice/add_slice_dependency.js'
import { memoize_cb } from './callbacks.js'
// import { update_type } from './constants.js'

function add_lifecycle_hooks () {
  this.on = {
    add: (fn) => this.add_callbacks.push(fn),
    reactiveUpdate: (fn, ...deps) => update.call(this, fn, deps, 'reactive'),
    beforeUpdate: (fn, ...deps) => update.call(this, fn, deps, 'before'),
    domUpdate: (fn, ...deps) => update.call(this, fn, deps, 'dom'),
    afterUpdate: (fn, ...deps) => update.call(this, fn, deps, 'after'),
    remove: (fn) => this.remove_callbacks.push(fn)
  }
}

function update (fn, deps, type) {
  // // console.log({ deps })
  // fn.lifecycle = type
  if (!deps) throw new Error(`No Dependency array given in ${fn.name}`)
  else {
    // batch if not reactive update
    const cb = (type !== 'reactive') ? memoize_cb.call(this, fn, type) : fn
    // return array of cleanups
    return deps.map(d => add_slice_dependency.call(this, d.split('.'), cb, type))
  }
}

export default add_lifecycle_hooks
