export function call$Cbs (target, chain) {
  // console.log('$ this: ', this)
  target.$.reactive.forEach(cb => cb.call(this, chain))
  target.$.before.forEach(cb => cb.call(this, chain))
  target.$.dom.forEach(cb => cb.call(this, chain))
  target.$.after.forEach(cb => cb.call(this, chain))
}

export function callAllCbs (target, chain) {
  for (const k in target) {
    if (k === '$') call$Cbs.call(this, target, chain)
    else callAllCbs.call(this, target[k])
  }
}

// convert consecutive calls to single call
export function callCbOnce (fn, type) {
  const fnId = '' + Math.random()
  const _this = this
  // console.log('call once this :', this)
  return (...args) => {
    if (!_this.registeredCallbacks[fnId]) {
      _this.registeredCallbacks[type][fnId] = { fn, args, type }
    } else {
      console.log('already added =', fn)
    }
  }
}
