import { silentMutate } from '../reactivity/mutate.js'
import { call_$_cbs, call_all_cbs } from '../callbacks.js'

let startedCollecting
const callObj = { calls: [] }

function call_memoized_callbacks (obj) {
  Object.keys(obj).forEach(k => {
    const { fn, args } = obj[k]
    fn(...args)
  })
}

function on_update (chain, value, trap) {
  if (this.ignore_chain === chain[0]) return true

  if (!startedCollecting) {
    startedCollecting = true
    // wait for all the callbacks to complete
    setTimeout(() => {
      startedCollecting = false
      callObj.call = []
      const { before, after, reactive, dom } = this.memoized_callbacks

      // order should be exactly this
      call_memoized_callbacks(reactive)
      call_memoized_callbacks(before)
      call_memoized_callbacks(dom)
      call_memoized_callbacks(after)
    }, 0)
  }

  else {
    callObj.calls.push({ chain, value, trap })
  }

  // update the state object, but don't trigger on_update to avoid infinite loop
  const success = silentMutate(this.$, chain, value, trap)

  // ignore .length updates on array
  if (chain[chain.length - 1] === 'length') return success

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
      else call_all_cbs.call(this, target, chain)
    }
  })

  return success
}

export default on_update
