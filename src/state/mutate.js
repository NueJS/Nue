import { getTargetProp } from './getTargetProp'

/**
 * mutate the object at given path to newValue
 * @param {Record<string, any>} obj
 * @param {StatePath} path
 * @param {any} newValue
 */
export const mutate = (obj, path, newValue) => {
  const [target, prop] = getTargetProp(obj, path)
  return Reflect.set(target, prop, newValue)
}
