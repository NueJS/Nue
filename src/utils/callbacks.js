// call only the cbs in $ array in target
function call_cb_map (map, chain) {
  for (const [cb] of map) {
    cb.call(this, chain)
  }
}

export function call_$_cbs (target, chain) {
  const { reactive, dom, before, after } = target.$
  call_cb_map.call(this, reactive, chain)
  call_cb_map.call(this, before, chain)
  call_cb_map.call(this, dom, chain)
  call_cb_map.call(this, after, chain)
}

export function call_all_cbs (target, chain) {
  for (const k in target) {
    if (k === '$') call_$_cbs.call(this, target, chain)
    else call_all_cbs.call(this, target[k])
  }
}

// convert consecutive calls to single call
// instead of using a flag, function is saved in registered_callbacks
// because it should be called once batching is completed
export function memoize_cb (fn, type) {
  const lifecycle = this.registered_callbacks[type]
  return (...args) => {
    if (!lifecycle.has(fn)) lifecycle.set(fn, args)
  }
}
