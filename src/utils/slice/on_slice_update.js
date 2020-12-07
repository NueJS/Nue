import { silentMutate } from '../reactivity/mutate.js'
import { call_$_cbs, call_all_cbs } from '../callbacks.js'

function call_lifecycle_methods (lifecycle) {
  for (const [fn, args] of lifecycle) {
    fn(args)
  }
}

function on_slice_update (chain, value, trap) {
  if (this.ignore_chain === chain[0]) return true

  if (!this.collecting_cbs) {
    this.collecting_cbs = true
    // wait for all the callbacks to complete
    setTimeout(() => {
      this.collecting_cbs = false
      const { before, after, reactive, dom } = this.registered_callbacks

      // order should be exactly this
      call_lifecycle_methods(reactive)
      call_lifecycle_methods(before)
      call_lifecycle_methods(dom)
      call_lifecycle_methods(after)

      this.clear_memoized_callbacks()
      // console.log('callbacks called : ', this.registered_callbacks)
    }, 0)
  }

  // update the state object, but don't trigger on_slice_update to avoid infinite loop
  // const success = silentMutate(this.$, chain, value, trap)

  // ignore .length updates on array
  // if (chain[chain.length - 1] === 'length') return success

  console.log('chain', chain)

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

  // return success
}

export default on_slice_update
