import { targetProp } from '../state/slice.js'

export const mutate = (obj, path, value, trap) => {
  const [target, prop] = targetProp(obj, path)
  return Reflect[trap](target, prop, value)
}
