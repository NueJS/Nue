import { createError } from '../createError'
import { getCode } from '../getCode'
import { nodeName } from '../name'

/**
 * @param {Element} node
 * @param {string} attributeName
 * @param {Comp} comp
 * @returns {Error}
 */

export const component_attribute_used_on_non_component_error = (node, attributeName, comp) => {

  const nodeNameString = nodeName(node)

  const issue = `\
'${attributeName}' attribute can only be used on a component,
but it is used on a non-component element ${nodeNameString}`

  const fix = `\
Remove this attribute if ${nodeNameString} is not a component

If ${nodeNameString} is actually a component, make sure to declare it in the components() method
`

  const code = getCode(comp, attributeName)

  const type = 'component_attribute_used_on_non_component_error'
  return createError(type, issue, fix, comp, code)

}

/**
 *
 * @param {Comp} comp
 * @param {string} content
 * @param {string} text
 * @returns {Error}
 */
export const function_placeholder_used_in_input_binding = (comp, content, text) => {
  const issue = 'function placeholder used on input binding'

  const fix = `\
input binding must be a state placeholder.

EXAMPLE:
✔ :input=[foo]
✖ :input=[someFn(bar)]`

  const code = getCode(comp, text)
  const type = 'function_placeholder_used_in_input_binding'

  return createError(type, issue, fix, comp, code)
}
