import { silentMutate } from '../reactivity/mutate.js'
import { call_$_cbs, call_all_cbs } from '../callbacks.js'

function call_memoized_callbacks (obj) {
  Object.keys(obj).forEach(k => {
    const { fn, args } = obj[k]
    fn(...args)
  })
}

function on_slice_update (chain, value, trap) {
  if (this.ignore_chain === chain[0]) return true

  if (!this.collecting_cbs) {
    this.collecting_cbs = true
    // wait for all the callbacks to complete
    setTimeout(() => {
      this.collecting_cbs = false
      const { before, after, reactive, dom } = this.memoized_callbacks

      // order should be exactly this
      call_memoized_callbacks(reactive)
      call_memoized_callbacks(before)
      call_memoized_callbacks(dom)
      call_memoized_callbacks(after)

      // reset all callbacks
      // this.changed_slices = []
      this.clear_memoized_callbacks()
    }, 0)
  }

  else {
    // this.changed_slices.push({ chain, value, trap })
  }

  // update the state object, but don't trigger on_slice_update to avoid infinite loop
  const success = silentMutate(this.$, chain, value, trap)

  // ignore .length updates on array
  if (chain[chain.length - 1] === 'length') return success

  // console.log({ chain })

  // call cbs which deps on any change in $
  // this.stateDeps.$.reactive.forEach(cb => cb())
  // this.stateDeps.$.before.forEach(cb => cb())
  // this.stateDeps.$.dom.forEach(cb => cb())
  // this.stateDeps.$.after.forEach(cb => cb())

  // call cbs which need to be called
  let target = this.stateDeps
  chain.forEach((c, i) => {
    if (typeof target !== 'object') return
    target = target[c]
    if (target) {
      if (i !== chain.length - 1) call_$_cbs.call(this, target, chain)
      else {
        // console.log('call all of ', c)
        call_all_cbs.call(this, target, chain)
      }
    }
  })

  return success
}

export default on_slice_update
