import { joinTagArgs } from '../string/joinTagArgs'
import { modes } from '../reactivity/modes.js'
import { dashifyComponentNames } from '../string/dashify.js'
import { errors } from '../dev/errors/index.js'
import { data } from '../data'

/**
 * run compFn
 * @param {Comp} comp
 * @param {CompFn} compFn
 * @param {boolean} isTemplateParsed
 * @returns {[string, string, CompFn[]]}
 */
export const runComponent = (comp, compFn, isTemplateParsed) => {
  /** @type {CompFn[]} */
  let childComponents = []

  let htmlString = ''
  let cssString = ''

  /** @type {TaggedTemplate} */
  const html = (strings, ...exprs) => {
    if (isTemplateParsed) return
    htmlString = joinTagArgs(strings, exprs)
  }

  /** @type {TaggedTemplate} */
  const css = (strings, ...exprs) => {
    if (isTemplateParsed) return
    cssString = joinTagArgs(strings, exprs)
  }

  /** @param {CompFn[]} _childComponents */
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

    if (isTemplateParsed) return
    childComponents = _childComponents
  }

  modes._reactive = false
  modes._noOverride = true

  const { $, refs, fn, hooks } = comp

  compFn({ $, refs, fn, hooks, html, components, css })

  modes._reactive = true
  modes._noOverride = false

  return [
    dashifyComponentNames(htmlString, childComponents),
    cssString,
    childComponents
  ]
}
