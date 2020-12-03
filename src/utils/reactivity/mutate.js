// mutate the object using chain to find target,
// value to to change the value on target
// and trap to define the kind of change

// example:
// to do -> obj.x.y.z = 100, call mutate like this:
// mutate(obj, ['x', 'y', 'z'], 100, 'set')

const mutate = ($, chain, value, trap) => {
  let target = $
  chain.slice(0, -1).forEach((key) => (target = target[key]))
  const prop = chain[chain.length - 1]
  return Reflect[trap](target, prop, value)
}

// mutate the $ but don't call onChange
// use silentMutate when you want to make the change but
const silentMutate = ($, ...args) => {
  $.__setDisableOnChange__(true)
  const success = mutate($, ...args)
  $.__setDisableOnChange__(false)
  return success
}

export { mutate, silentMutate }
