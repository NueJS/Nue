import { NO_OVERRIDE_MODE, REACTIVE_MODE } from '../constants.js'
import modes from '../reactivity/modes.js'
import { dashifyComponentNames } from '../string/dashify.js'

// @todo move it to other file
/**
 *
 * @param {Array<string>} strings
 * @param  {...string} exprs
 * @returns
 */
const tag = (strings, ...exprs) =>
  exprs.reduce(
    (acc, expr, i) => acc + strings[i] + expr, ''
  ) + strings[strings.length - 1]

/**
 * run component
 * @param {import('../types').compNode} compNode
 * @param {Function} component
 * @param {boolean} parsed
 * @returns {[string, string, Array<Function>]}
 */
const runComponent = (compNode, component, parsed) => {
  /** @type {Array<Function>} */
  let childComponents = []
  let templateString = ''
  let cssString = ''

  /** @param {...string} args */
  const html = (...args) => {
    if (parsed) return
    // @ts-expect-error
    templateString = tag(...args)
  }

  /** @param {...string} args */
  const css = (...args) => {
    if (parsed) return

    // @ts-expect-error
    cssString = tag(...args)
  }

  /** @param {Array<Function>} _childComponents */
  const components = _childComponents => {
    if (parsed) return
    childComponents = _childComponents
  }

  modes[REACTIVE_MODE] = false
  modes[NO_OVERRIDE_MODE] = true

  const { $, refs, fn, events } = compNode
  component({ $, refs, fn, ...events, events, html, components, css })

  modes[REACTIVE_MODE] = true
  modes[NO_OVERRIDE_MODE] = false

  return [
    dashifyComponentNames(templateString, childComponents),
    cssString,
    childComponents
  ]
}

export default runComponent
