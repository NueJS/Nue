import { createError } from '../utils/createError'
import { angularCompName } from '../utils/angularName'
import { getCodeWithError } from '../utils/code'

/**
 * called when onMutate is called without a second argument of dependency array
 * @param {Comp} comp
 * @returns {Error}
 */

export const missing_dependency_array_in_onMutate = (comp) => {
  const issue = `Missing dependencies in onMutate() in ${angularCompName(comp)}`

  const fix = `\
onMutate hook expects a dependency array as second argument.

Example:
onMutate(() => { ... }, [ 'foo', 'bar.baz'])`

  const errorCode = getCodeWithError(comp, /onMutate(\\w*)/)

  return createError(issue, fix, comp, errorCode, missing_dependency_array_in_onMutate.name)
}
