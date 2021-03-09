import { NO_OVERRIDE_MODE, REACTIVE_MODE } from '../constants.js'
import modes from '../reactivity/modes.js'
import { dashifyComponentNames } from '../string/dashify.js'

const tag = (strings, ...exprs) => exprs.reduce((acc, expr, i) => acc + strings[i] + expr, '') + strings[strings.length - 1]

const runScript = (compNode, component, parsed) => {
  let childComponents = []
  let templateString = ''
  let cssString = ''

  const html = (...args) => {
    if (parsed) return
    templateString = tag(...args)
  }

  const css = (...args) => {
    if (parsed) return
    cssString = tag(...args)
  }

  const components = (..._childComponents) => {
    if (parsed) return
    childComponents = _childComponents
  }

  modes[REACTIVE_MODE] = false
  modes[NO_OVERRIDE_MODE] = true

  const { $, refs, fn, events } = compNode
  component({ $, refs, fn, ...events, events, html, components, css })

  modes[REACTIVE_MODE] = true
  modes[NO_OVERRIDE_MODE] = false

  return [dashifyComponentNames(templateString, childComponents), cssString, childComponents]
}

export default runScript
