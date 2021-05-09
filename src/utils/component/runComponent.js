import { joinTagArgs } from '../string/joinTagArgs'
import { modes } from '../reactivity/modes.js'
import { dashifyComponentNames } from '../string/dashify.js'
import { errors } from '../dev/errors/index.js'

/**
 * run compFn
 * @param {Comp} comp
 * @param {CompFn} compFn
 * @param {boolean} isTemplateParsed
 * @returns {[string, string, CompFn[]]}
 */
export const runComponent = (comp, compFn, isTemplateParsed) => {
  /** @type {CompFn[]} */
  let childCompFns = []

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

  /** @param {CompFn[]} _childCompFns */
  const components = _childCompFns => {
    if (isTemplateParsed) return
    if (_DEV_) DEV_checkComponentsArgs(comp, _childCompFns)
    childCompFns = _childCompFns
  }

  modes._reactive = false
  modes._noOverride = true

  const { $, refs, fn, hooks } = comp
  compFn({ $, refs, fn, hooks, html, components, css })

  modes._reactive = true
  modes._noOverride = false

  return [
    dashifyComponentNames(htmlString, childCompFns),
    cssString,
    childCompFns
  ]
}

/**
 * DEV-ONLY
 * @param {Comp} comp
 * @param {CompFn[]} _childCompFns
 */
function DEV_checkComponentsArgs (comp, _childCompFns) {
  const throwError = () => {
    throw errors.invalid_args_given_to_components_method(comp)
  }

  const notArray = !Array.isArray(_childCompFns)
  if (notArray) throwError()

  const notArrayOfFunctions = !_childCompFns.every(item => typeof item === 'function')
  if (notArrayOfFunctions) throwError()
}
