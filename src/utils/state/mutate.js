import { targetProp } from './slice'

/**
 * mutate the object at given path to newValue
 * @param {Record<string, any>} obj
 * @param {StatePath} path
 * @param {any} newValue
 * @returns
 */
export const mutate = (obj, path, newValue) => {
  const [target, prop] = targetProp(obj, path)
  return Reflect.set(target, prop, newValue)
}
