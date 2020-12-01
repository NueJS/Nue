import { silentMutate } from './mutate.js'
import { call$Cbs, callAllCbs } from './cbs.js'

function onChange (chain, value, trap) {
  if (this.ignoreStateChange === chain[0]) return true
  const success = silentMutate(this.$, chain, value, trap)
  // ignore .length updates
  if (chain[chain.length - 1] === 'length') return success

  // console.log({ chain })

  // call cbs which deps on any change in $
  this.stateDeps.$.forEach(cb => cb())

  // call cbs which need to be called
  let target = this.stateDeps
  chain.forEach((c, i) => {
    if (typeof target !== 'object') return
    target = target[c]
    if (target) {
      if (i !== chain.length - 1) call$Cbs(target, chain)
      else callAllCbs(target, chain)
    }
  })

  return success
}

export default onChange
