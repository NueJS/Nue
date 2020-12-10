// import slice from './slice/slice.js'

// call only the cbs in $ array in target
function call_cb_map (map, info) {
  for (const [cb] of map) {
    cb.call(this, info)
  }
}

export function call_$_cbs (target, info) {
  const { reactive, dom, before, after } = target.$
  call_cb_map.call(this, reactive, info)
  call_cb_map.call(this, before, info)
  call_cb_map.call(this, dom, info)
  call_cb_map.call(this, after, info)
}

export function call_all_cbs (target, info) {
  for (const k in target) {
    if (k === '$') call_$_cbs.call(this, target, info)
    else call_all_cbs.call(this, target[k], info)
  }
}

// convert consecutive calls to single call
// instead of using a flag, function is saved in queue
// because it should be called once batching is completed
export function memoize_cb (fn, type) {
  const lifecycle = this.queue[type]
  return (...args) => {
    if (!lifecycle.has(fn)) lifecycle.set(fn, ...args)
  }
}
