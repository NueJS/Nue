// call only the cbs in $ array in target
export function call_$_cbs (target, chain) {
  for (const k in target.$) {
    target.$[k].forEach(cb => cb.call(this, chain))
  }
  // target.$.reactive.forEach(call)
  // target.$.before.forEach(call)
  // target.$.dom.forEach(call)
  // target.$.after.forEach(call)
}

export function call_all_cbs (target, chain) {
  for (const k in target) {
    if (k === '$') call_$_cbs.call(this, target, chain)
    else call_all_cbs.call(this, target[k])
  }
}

// convert consecutive calls to single call
// instead of using a flag, function is saved in memoized_callbacks
// because it should be called once batching is completed
export function memoize_cb (fn, type) {
  // create a unique id
  const fnId = '' + Math.random()
  return (...args) => {
    // if not added in callbacks, add it
    // else ignore
    if (!this.memoized_callbacks[type][fnId]) {
      this.memoized_callbacks[type][fnId] = { fn, args }
    }
  }
}
