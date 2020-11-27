import { silentMutate } from './mutate.js'

function onChange (chain, value, trap) {
  const success = silentMutate(this.state, chain, value, trap)
  if (chain[chain.length - 1] === 'length') return success
  const key = chain[0]

  if (this.compObj.onStateChange) this.compObj.onStateChange.call(this, key)

  // this.computedStateDeps.forEach(ob => {
  //   if (ob.notFor !== key) ob.callback()
  // })

  let target = this.stateDeps
  chain.forEach(c => {
    target = target[c]
    if (target) target.$.forEach(cb => cb(chain))
  })

  // const cbs = this.stateDeps[key]
  // if (cbs) cbs.forEach(f => f())

  return success
}

export default onChange
