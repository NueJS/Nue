import { data } from '../data'

/**
 *
 * @param {string} type
 * @param {string} issue
 * @param {string} fix
 * @param {Comp} comp
 * @param {string} [code]
 * @returns {NueError}
 */
export const createError = (type, issue, fix, comp, code) => {
  const compFn = data._components[comp._compFnName]
  console.log('%cerror in :', 'color: yellow')
  console.log(comp)

  console.log(' ')

  console.log('%cdefinition : (click to open full source code)', 'color: yellow')
  console.log(compFn)

  console.log(' ')

  const error = /** @type {NueError}*/(new Error(`${code ? `\n\n${code}\n\n` : ''}${issue}\n\n${fix}\n`))
  error.code = code
  error.fix = fix
  error.issue = issue
  error.name = `nuejs error : ${type}`

  return error
}
