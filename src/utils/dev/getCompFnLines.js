import { data } from '../data'

/**
 *
 * @param {Comp} comp
 * @return {string[]}
 */
export const getCompFnLines = (comp) => {
  const compFn = data._components[comp._compFnName]
  return compFn.toString().split('\n')
}
