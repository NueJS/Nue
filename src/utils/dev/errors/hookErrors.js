import { createError } from '../utils/createError'
import { getCodeWithError } from '../utils/code'

/**
 * called when onMutate is called without a second argument of dependency array
 * @param {Comp} comp
 * @returns {Error}
 */

export const missing_dependency_array_in_onMutate = (comp) => {
  const compName = `<${comp._compName}>`
  const issue = `Missing dependencies in onMutate() in ${compName}`

  const fix = `\
onMutate hook expects a dependency array as second argument.

Example:
onMutate(callbackFn, [ 'foo', 'bar.baz' ])`

  const errorCode = getCodeWithError(comp._compName, /onMutate(\\w*)/)

  return createError(issue, fix, comp, errorCode, missing_dependency_array_in_onMutate.name)
}
