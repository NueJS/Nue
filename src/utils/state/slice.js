/**
 * return [target, prop] for given path in object
 * @param {Record<string, any>} obj
 * @param {import("../types").path} path
 * @returns {[Record<string, any>, any]}
 */

export const targetProp = (obj, path) => {
  const target = path.slice(0, -1).reduce((target, key) => target[key], obj)
  const prop = path[path.length - 1]
  return [target, prop]
}
