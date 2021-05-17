import { data } from '../data'

/**
 * create an error object that to be shown in error-overlay and in console
 * @param {string} issue
 * @param {string} fix
 * @param {HTMLElement} [code]
 * @param {string} [compName]
 * @returns {NueError}
 */
export const createError = (issue, fix, code, compName) => {

  // get the component function
  if (compName) {
    const compDef = data._components[compName]
    console.error(compDef._class)
  }

  console.log(' ')

  const error = /** @type {NueError}*/(new Error(`\n${issue}\n\n${fix}\n`))

  if (code) error.code = code
  error.fix = fix
  error.issue = issue
  error.name = compName ? `nue.error in ${compName}` : 'nue.error'

  return error
}
