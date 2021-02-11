import { runQueue } from '../callbacks.js'
import { runEvent } from '../lifecycle.js'

const clearQueue = (comp) => {
  for (const key in comp.queue) {
    comp.queue[key].clear()
  }
}

const queueOrder = ['computed', 'stateReady', 'dom']

// wait for all the callbacks to be registered and then call all of them in proper order
const invokeQueue = (comp) => {
  // don't trigger setTimeout again once the collecting is started
  comp.batching = true

  // after all the callbacks are triggered by state mutation, call callbacks in proper order
  setTimeout(() => {
    runEvent(comp, 'beforeUpdate')
    for (const queueName of queueOrder) runQueue(comp, queueName)
    clearQueue(comp)
    runEvent(comp, 'afterUpdate')
    // allow the queue to being built for next state mutation
    comp.batching = false
  }, 0)
}

export default invokeQueue
