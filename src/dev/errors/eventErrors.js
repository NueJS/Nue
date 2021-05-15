import { createError } from '../createError'
import { getCodeWithError } from '../code'

/**
 * called when onMutate is called without a second argument of dependency array
 * @param {string} compName
 */

export const missing_dependency_array_in_onMutate = (compName) => {

  const issue = `Missing dependencies in onMutate() in ${compName}`

  const fix = `\
onMutate hook expects a dependency array as second argument.

Example:
onMutate(callbackFn, [ 'foo', 'bar.baz' ])`

  const code = getCodeWithError(compName, /onMutate(\\w*)/)

  return createError(issue, fix, code, compName)
}
