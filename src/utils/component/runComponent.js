import { joinTagArgs } from '../string/joinTagArgs'
import { modes } from '../reactivity/modes.js'
import { dashifyComponentNames } from '../string/dashify.js'
import { errors } from '../dev/errors/index.js'
import { data } from '../data'

/**
 * run compFn
 * @param {Comp} comp
 * @param {Function} compFn
 * @param {boolean} parsed
 * @returns {[string, string, Function[]]}
 */
export const runComponent = (comp, compFn, parsed) => {
  /** @type {Function[]} */
  let childComponents = []

  let htmlString = ''
  let cssString = ''

  /** @type {TaggedTemplate} */
  const html = (strings, ...exprs) => {
    if (parsed) return
    htmlString = joinTagArgs(strings, exprs)
  }

  /** @type {TaggedTemplate} */
  const css = (strings, ...exprs) => {
    if (parsed) return
    cssString = joinTagArgs(strings, exprs)
  }

  /** @param {Function[]} _childComponents */
  const components = _childComponents => {

    if (_DEV_ && !data._errorThrown) {
      const throwError = () => {
        throw errors.invalid_args_given_to_components_method(comp)
      }
      const notArray = !Array.isArray(_childComponents)
      if (notArray) throwError()
      const notArrayOfFunctions = !_childComponents.every(item => typeof item === 'function')
      if (notArrayOfFunctions) throwError()
    }

    if (parsed) return
    childComponents = _childComponents
  }

  modes._reactive = false
  modes._noOverride = true

  const { $, refs, fn, hooks } = comp
  compFn({ $, refs, fn, ...hooks, hooks, html, components, css })

  modes._reactive = true
  modes._noOverride = false

  return [
    dashifyComponentNames(htmlString, childComponents),
    cssString,
    childComponents
  ]
}
