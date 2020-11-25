import { silentMutate } from './mutate.js'

function onChange (chain, value, trap) {
  const success = silentMutate(this.state, chain, value, trap)
  if (chain[chain.length - 1] === 'length') return success

  const key = chain[0]
  let cbs

  if (this.compObj.onStateChange) this.compObj.onStateChange.call(this, key)

  cbs = this.computedStateDeps[key]
  if (cbs) cbs.forEach(c => c())

  cbs = this.stateDeps[key]
  if (cbs) cbs.forEach(f => f())

  return success
}

export default onChange
