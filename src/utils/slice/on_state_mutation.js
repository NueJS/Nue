import { call_$_cbs, call_all_cbs } from '../callbacks.js'

// when state is mutated, find cbs that should be triggered for given path
// triggering callbacks in beforeUpdate and afterUpdate may mutate the state further
// which would trigger some more callbacks, to avoid calling the same cb more than once, build a queue
// once a cb is added in queue it is not added again
function on_state_mutation (path, old) {
  // to avoid infinite loop
  // if this component triggered state change in parent and as a result component's own state is again mutated
  // this would create infinite loop, to prevent that, do not process such state mutation
  if (this.ignore_path === path[0]) return true

  // if queue is being built, don't invoke, invoke once the building is stopped
  if (!this.building_queue) invoke_queue.call(this)
  if (this.building_queue) build_queue.call(this, path, old)
}

// wait for all the callbacks to be registered and then call all of them in proper order
function invoke_queue () {
  // don't trigger setTimeout again once the collecting is started
  this.building_queue = true

  // after all the callbacks are triggered by state mutation, call callbacks in proper order
  setTimeout(() => {
    // this order matters
    invoke_cbs(this.queue.before)
    invoke_cbs(this.queue.dom)
    invoke_cbs(this.queue.after)

    // once all cbs are invoked, clear the queue
    this.clear_queue()

    // allow the queue to being built for next state mutation
    this.building_queue = false
  }, 0)
}

function invoke_cbs (lifecycle) {
  for (const [fn, args] of lifecycle) {
    fn(args)
  }
}

// call cbs which need to be called
function build_queue (path, info) {
  let target = this.slice_deps
  path.forEach((c, i) => {
    if (typeof target !== 'object') return
    target = target[c]
    if (target) {
      if (i !== path.length - 1) call_$_cbs.call(this, target, info)
      else call_all_cbs.call(this, target, info)
    }
  })
}

export default on_state_mutation
