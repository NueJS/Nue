import { createError } from '../utils/createError'
import { getCodeWithError } from '../utils/code'
import { angularNodeName } from '../utils/angularName'

/**
 * called when a component specific attribute is added on a non-component element
 * @param {Element} node
 * @param {string} attributeName
 * @param {Comp} comp
 * @returns {Error}
 */

export const component_attribute_used_on_non_component = (node, attributeName, comp) => {

  const nodeName = angularNodeName(node)

  const issue = `\
'${attributeName}' attribute can only be used on a component,
but it is used on a non-component element ${nodeName}`

  const fix = `\
Remove this attribute if ${nodeName} is not a component

If ${nodeName} is actually a component, make sure to declare it in the components() method
`

  const errorCode = getCodeWithError(comp, new RegExp(attributeName))

  return createError(issue, fix, comp, errorCode, component_attribute_used_on_non_component.name)

}

/**
 * called when a function placeholder is used in input attribute binding
 * @param {Comp} comp
 * @param {string} text
 * @returns {Error}
 */
export const function_placeholder_used_in_input_binding = (comp, text) => {
  const issue = 'function placeholder used on input binding'

  const fix = `\
input binding must be a state placeholder.

EXAMPLE:
✔ :input=[foo]
✖ :input=[someFn(bar)]`

  const code = getCodeWithError(comp, new RegExp(text))

  return createError(issue, fix, comp, code, function_placeholder_used_in_input_binding.name)
}
