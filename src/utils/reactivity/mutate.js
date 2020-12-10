// import modes from './modes.js'

// mutate the object using path to find target,
// value to to change the value on target
// and trap to define the kind of change

// example:
// to do -> obj.x.y.z = 100, call mutate like this:
// mutate(obj, ['x', 'y', 'z'], 100, 'set')

export const mutate = ($, path, value, trap) => {
  let target = $
  path.slice(0, -1).forEach((key) => (target = target[key]))
  const prop = path[path.length - 1]
  return Reflect[trap](target, prop, value)
}
