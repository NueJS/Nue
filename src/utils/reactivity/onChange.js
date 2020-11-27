import { silentMutate } from './mutate.js'

function onChange (chain, value, trap) {
  const success = silentMutate(this.state, chain, value, trap)
  if (chain[chain.length - 1] === 'length') return success
  console.log({ chain })
  // const key = chain[0]

  // if (this.compObj.on.change) this.compObj.onStateChange.call(this, key)

  // this.computedStateDeps.forEach(ob => {
  //   if (ob.notFor !== key) ob.callback()
  // })

  const call$Cbs = target => target.$.forEach(cb => cb(chain))

  function callAllCbs (target) {
    for (const k in target) {
      if (k === '$') call$Cbs(target)
      else callAllCbs(target[k])
    }
  }

  let target = this.stateDeps
  chain.forEach((c, i) => {
    target = target[c]
    if (target) {
      if (i !== chain.length - 1) call$Cbs(target)
      else callAllCbs(target)
    }
  })

  return success
}

export default onChange
