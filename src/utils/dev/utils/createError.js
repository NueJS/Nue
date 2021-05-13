import { data } from '../../data'

/**
 * create an error object that to be shown in error-overlay and in console
 * @param {string} issue
 * @param {string} fix
 * @param {Comp | null} comp
 * @param {string} errorCode
 * @param {string} errorName
 * @returns {NueError}
 */
export const createError = (issue, fix, comp, errorCode, errorName) => {

  // get the component function
  if (comp) {
    const compClass = data._definedComponents[comp._compName]

    console.error(compClass)
    console.error(comp)
  }

  console.log(' ')

  const error = /** @type {NueError}*/(new Error(`${errorCode ? `\n\n${errorCode}\n\n` : ''}${issue}\n\n${fix}\n`))
  error.code = errorCode
  error.fix = fix
  error.issue = issue
  error.name = `nue.js error : ${errorName}`

  return error
}
