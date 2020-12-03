import { silentMutate } from './mutate.js'
import { call$Cbs, callAllCbs } from './cbs.js'

let startedCollecting
const callObj = { calls: [] }

function callRegisteredCbs (obj) {
  Object.keys(obj).forEach(k => {
    const { fn, args } = obj[k]
    fn(...args)
  })
}

function onChange (chain, value, trap) {
  if (this.ignoreStateChange === chain[0]) return true

  if (!startedCollecting) {
    startedCollecting = true
    setTimeout(() => {
      console.log(this.registeredCallbacks)
      console.log('all called')
      startedCollecting = false
      callObj.call = []

      const { before, after, reactive, dom } = this.registeredCallbacks

      // order should be exactly this
      callRegisteredCbs(reactive)
      callRegisteredCbs(before)
      callRegisteredCbs(dom)
      callRegisteredCbs(after)
    }, 0)
  } else {
    callObj.calls.push({ chain, value, trap })
  }

  // update the state object, but don't trigger onChange to avoid infinite loop
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
      if (i !== chain.length - 1) call$Cbs.call(this, target, chain)
      else callAllCbs.call(this, target, chain)
    }
  })

  return success
}

export default onChange
