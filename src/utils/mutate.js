const mutate = (state, chain, value, trap) => {
  let target = state
  chain.slice(0, -1).forEach((key) => (target = target[key]))
  const prop = chain[chain.length - 1]
  return Reflect[trap](target, prop, value)
}

// mutate the state but do not call onChange
const silentMutate = (state, ...args) => {
  state.__disableOnChange__(true)
  const success = mutate(state, ...args)
  state.__disableOnChange__(false)
  return success
}

export { mutate, silentMutate }
