import { silentMutate } from './mutate.js'
import { call$Cbs, callAllCbs } from './cbs.js'

function onChange (chain, value, trap) {
  const success = silentMutate(this.state, chain, value, trap)
  // ignore .length updates
  if (chain[chain.length - 1] === 'length') return success

  // call cbs which deps on any change in state
  this.stateDeps.$.forEach(cb => cb())

  // call cbs which need to be called
  let target = this.stateDeps
  chain.forEach((c, i) => {
    target = target[c]
    if (target) {
      if (i !== chain.length - 1) call$Cbs(target, chain)
      else callAllCbs(target, chain)
    }
  })

  return success
}

export default onChange
