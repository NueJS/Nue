import { triggerMapCbs } from '../callbacks.js'

const clearQueue = (comp) => {
  for (const key in comp.queue) {
    comp.queue[key].clear()
  }
}

// wait for all the callbacks to be registered and then call all of them in proper order
function invokeQueue (comp) {
  // don't trigger setTimeout again once the collecting is started
  comp.batching = true

  // after all the callbacks are triggered by state mutation, call callbacks in proper order
  setTimeout(() => {
    comp.beforeUpdateCbs.forEach(cb => cb())

    // all dom updates are batched here
    triggerMapCbs(comp.queue.computed)
    triggerMapCbs(comp.queue.stateReady)
    triggerMapCbs(comp.queue.dom)

    comp.afterUpdateCbs.forEach(cb => cb())

    // once all cbs are invoked, clear the queue
    clearQueue(comp)

    // allow the queue to being built for next state mutation
    comp.batching = false
  }, 0)
}

export default invokeQueue
