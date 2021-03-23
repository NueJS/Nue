import joinTagArgs from 'utils/string/joinTagArgs.js'
import modes from '../reactivity/modes.js'
import { dashifyComponentNames } from '../string/dashify.js'

/** @typedef {(strings: string[], ...exprs: string[] ) => void} TaggedTemplate */

/**
 * run compFn
 * @param {import('types/dom').Comp} comp
 * @param {Function} compFn
 * @param {boolean} parsed
 * @returns {[string, string, Function[]]}
 */
const runComponent = (comp, compFn, parsed) => {
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
    if (parsed) return
    childComponents = _childComponents
  }

  modes.__reactive = false
  modes.__noOverride = true

  const { $, refs, fn, hooks } = comp
  compFn({ $, refs, fn, ...hooks, hooks, html, components, css })

  modes.__reactive = true
  modes.__noOverride = false

  return [
    dashifyComponentNames(htmlString, childComponents),
    cssString,
    childComponents
  ]
}

export default runComponent
