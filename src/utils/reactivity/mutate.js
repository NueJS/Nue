const mutate = ($, chain, value, trap) => {
  let target = $
  chain.slice(0, -1).forEach((key) => (target = target[key]))
  const prop = chain[chain.length - 1]
  return Reflect[trap](target, prop, value)
}

// mutate the $ but do not call onChange
const silentMutate = ($, ...args) => {
  $.__setDisableOnChange__(true)
  const success = mutate($, ...args)
  $.__setDisableOnChange__(false)
  return success
}

export { mutate, silentMutate }
