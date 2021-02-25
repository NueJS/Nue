import devtools from '../apis/devtools.js'
import DEV from './dev/DEV.js'

// @todo reduce the amount of functions in this file - they all are very similar
export const runBatch = (nue, name) => {
  const map = nue.queue[name]
  for (const [cb, args] of map) {
    if ((cb.node && cb.node.isSubscribed) || !cb.node) {
      cb(args)
      // show node updates
      if (DEV && cb.node && devtools.showUpdates) devtools.onNodeUpdate(cb.node)
    }
  }
}

// only trigger cbs in $ Map
export const trigger$Cbs = (nue, target, info) => {
  target.$.forEach(cb => cb(nue, info))
}

// trigger all the cbs in the object
export const triggerAllCbs = (nue, target, info) => {
  for (const k in target) {
    if (k === '$') trigger$Cbs(nue, target, info)
    else triggerAllCbs(nue, target[k], info)
  }
}

// convert consecutive calls to single call
// instead of using a flag, function is saved in queue
// because it should be called once batching is completed
export const cbQueuer = (nue, cb, type) => {
  const queue = nue.queue[type]
  const qcb = (...args) => queue.set(cb, ...args)
  qcb.node = cb.node // @todo remove this
  return qcb
}

// find callbacks that are subscribed to given path and trigger them
export const triggerDeps = (nue, path, info) => {
  let target = nue.subscriptions
  path.forEach((c, i) => {
    // if primitive, return
    if (typeof target !== 'object') return
    target = target[c]
    if (target) {
      // if last index, trigger cbs of target.$
      if (i !== path.length - 1) trigger$Cbs(nue, target, info)
      // deeply trigger all inside target.*
      triggerAllCbs(nue, target, info)
    }
  })
}
