import { createError } from '../createError'
import { compName } from '../name'

/**
 * @param {Comp} comp
 * @returns {Error}
 */

export const missing_dependency_array_in_onMutate = (comp) => {
  const issue = `Missing dependencies in onMutate() in ${compName(comp)}`

  const fix = `\
onMutate hook expects a dependency array as second argument.

Example:
onMutate(() => { ... }, [ 'foo', 'bar.baz'])`

  const type = 'missing_dependency_array_in_onMutate'
  return createError(type, issue, fix, comp)
}
