// import add_state_dep from './slice/add_state_dep.js'
// import { memoize_cb } from './callbacks.js'
// import { update_type } from './constants.js'

function add_lifecycle_hooks () {
  this.when = {
    component: {
      isAdded: (cb) => this.is_added_cbs.push(cb),
      isRemoved: (cb) => this.is_removed_cbs.push(cb),
      willUpdate: (cb) => this.will_update_cbs.push(cb),
      isUpdated: (cb) => this.is_updated_cbs.push(cb)
    }
    // $: this.$
  }
}

// function update (cb, deps, type) {
//   // // console.log({ deps })
//   // cb.lifecycle = type
//   if (!deps) throw new Error(`No Dependency array given in ${cb.name}`)
//   else {
//     // batch if not reactive update
//     const cb = (type !== 'reactive') ? memoize_cb.call(this, cb, type) : cb
//     // return array of cleanups
//     return deps.map(d => add_state_dep.call(this, d.split('.'), cb, type))
//   }
// }

export default add_lifecycle_hooks
