import { triggerMapCbs } from '../callbacks.js'

// wait for all the callbacks to be registered and then call all of them in proper order
function invokeQueue () {
  // don't trigger setTimeout again once the collecting is started
  this.batching = true

  // after all the callbacks are triggered by state mutation, call callbacks in proper order
  setTimeout(() => {
    this.beforeUpdateCbs.forEach(cb => cb())

    // all dom updates are batched here
    triggerMapCbs(this.queue.computed)
    triggerMapCbs(this.queue.stateReady)
    triggerMapCbs(this.queue.dom)

    this.afterUpdateCbs.forEach(cb => cb())

    // once all cbs are invoked, clear the queue
    this.clear_queue()

    // allow the queue to being built for next state mutation
    this.batching = false
  }, 0)
}

export default invokeQueue
