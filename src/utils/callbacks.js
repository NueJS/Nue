
export function triggerMapCbs (map) {
  for (const [fn, args] of map) {
    fn(args)
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
export function cbQueuer (fn, type) {
  const lifecycle = this.queue[type]
  return (...args) => {
    if (!lifecycle.has(fn)) lifecycle.set(fn, ...args)
  }
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
