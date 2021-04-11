import { createError } from '../utils/createError'
import { getCodeWithError } from '../utils/code'
import { toJSON } from '../utils/toJSON'

/**
 * called when invalid argument is given to the components method in component
 * @param {Comp} comp
 * @return {NueError}
 */
export const invalid_args_given_to_components_method = (comp) => {
  const issue = 'components() method expects an array of components, but got this instead:'
  const errorCode = getCodeWithError(comp, /components\(.*\)/)
  return createError(issue, '', comp, errorCode, invalid_args_given_to_components_method.name)
}

/**
 * called when component is not a function
 * @param {any} compFn
 * @returns
 */
export const component_is_not_a_function = (compFn) => {
  const issue = `components must be functions, not ${typeof compFn}`
  const fix = 'change this to a valid component function:'
  return createError(issue, fix, null, toJSON(compFn), component_is_not_a_function.name)
}
