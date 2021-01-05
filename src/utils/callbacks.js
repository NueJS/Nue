import devtools from '../apis/devtools.js'
import DEV from './dev/DEV.js'

export function triggerMapCbs (map) {
  for (const [cb, args] of map) {
    if ((cb.node && cb.node.sweet.isConnected) || !cb.node) {
      cb(args)
      if (DEV) {
        if (devtools.showUpdates && cb.node) {
          devtools.onNodeUpdate(cb.node)
        }
      }
    }
  }
}

// only trigger cbs in $ Map
export function trigger$Cbs (comp, target, info) {
  for (const [cb] of target.$) {
    cb(comp, info)
  }
}

// trigger all the cbs in the object
export function triggerAllCbs (comp, target, info) {
  for (const k in target) {
    if (k === '$') trigger$Cbs(comp, target, info)
    else triggerAllCbs(comp, target[k], info)
  }
}

// convert consecutive calls to single call
// instead of using a flag, function is saved in queue
// because it should be called once batching is completed
export function cbQueuer (comp, cb, type) {
  const lifecycle = comp.queue[type]
  const qcb = (...args) => {
    if (!lifecycle.has(cb)) lifecycle.set(cb, ...args)
  }

  qcb.node = cb.node
  return qcb
}

// find deps that needs to be called for given path update and trigger them
export function triggerDeps (comp, path, info) {
  let target = comp.deps
  path.forEach((c, i) => {
    if (typeof target !== 'object') return
    target = target[c]
    if (target) {
      if (i !== path.length - 1) trigger$Cbs(comp, target, info)
      triggerAllCbs(comp, target, info)
    }
  })
}
