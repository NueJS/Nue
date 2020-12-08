// import { silentMutate } from '../reactivity/mutate.js'
import { call_$_cbs, call_all_cbs } from '../callbacks.js'

function on_slice_update (chain) {
  if (this.ignore_chain === chain[0]) return true
  register_callbacks.call(this)
  notify_callbacks.call(this, chain)
}

// wait for all the callbacks to be registered and then call all of them in proper order
function register_callbacks () {
  if (!this.collecting_cbs) {
    // don't trigger setTimeout again once the collecting is started
    this.collecting_cbs = true
    setTimeout(() => {
      this.collecting_cbs = false
      // const { before, after, reactive, dom } = this.registered_callbacks

      // call_lifecycle_methods(this.registered_callbacks.reactive)
      // debugger
      // console.group('cycle x')
      // console.log('before dom size : ', this.registered_callbacks.dom.size)
      call_lifecycle_methods(this.registered_callbacks.before)
      // console.log('after dom size : ', this.registered_callbacks.dom.size)
      // console.groupEnd('cycle x')
      call_lifecycle_methods(this.registered_callbacks.dom)
      call_lifecycle_methods(this.registered_callbacks.after)

      this.clear_memoized_callbacks()
    }, 0)
  }
}

function call_lifecycle_methods (lifecycle) {
  for (const [fn, args] of lifecycle) {
    fn(args)
  }
}

function notify_callbacks (chain) {
  // call cbs which need to be called
  let target = this.slice_deps
  chain.forEach((c, i) => {
    if (typeof target !== 'object') return
    target = target[c]
    if (target) {
      if (i !== chain.length - 1) call_$_cbs.call(this, target, chain)
      else call_all_cbs.call(this, target, chain)
    }
  })
}

export default on_slice_update
