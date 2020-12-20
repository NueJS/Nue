
export function triggerMapCbs (map) {
  for (const [cb, args] of map) {
    if ((cb.node && cb.node.sweet.isConnected) || !cb.node) {
      cb(args)
    }
  }
}

// only trigger cbs in $ Map
export function trigger$Cbs (target, info) {
  for (const [cb] of target.$) {
    cb.call(this, info)
  }
}

// trigger all the cbs in the object
export function triggerAllCbs (target, info) {
  for (const k in target) {
    if (k === '$') trigger$Cbs.call(this, target, info)
    else triggerAllCbs.call(this, target[k], info)
  }
}

// convert consecutive calls to single call
// instead of using a flag, function is saved in queue
// because it should be called once batching is completed
export function cbQueuer (cb, type) {
  const lifecycle = this.queue[type]
  const qcb = (...args) => {
    if (!lifecycle.has(cb)) lifecycle.set(cb, ...args)
  }

  qcb.node = cb.node
  return qcb
}

// find deps that needs to be called for given path update and trigger them
export function triggerDeps (path, info) {
  let target = this.deps
  path.forEach((c, i) => {
    if (typeof target !== 'object') return
    target = target[c]
    if (target) {
      if (i !== path.length - 1) trigger$Cbs.call(this, target, info)
      triggerAllCbs.call(this, target, info)
    }
  })
}
