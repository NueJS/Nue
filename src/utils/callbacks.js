export function call_$_cbs (target, chain) {
  const call = cb => cb.call(this, chain)
  // this order does not matter
  target.$.reactive.forEach(call)
  target.$.before.forEach(call)
  target.$.dom.forEach(call)
  target.$.after.forEach(call)
}

export function call_all_cbs (target, chain) {
  for (const k in target) {
    if (k === '$') call_$_cbs.call(this, target, chain)
    else call_all_cbs.call(this, target[k])
  }
}

// convert consecutive calls to single call
export function memoize_cb (fn, type) {
  const fnId = '' + Math.random()
  const _this = this
  return (...args) => {
    if (!_this.memoized_callbacks[fnId]) {
      _this.memoized_callbacks[type][fnId] = { fn, args, type }
    } else {
      console.log('duplicate', fn)
    }
  }
}
