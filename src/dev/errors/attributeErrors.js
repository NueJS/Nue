import { createError } from '../createError'
import { getCodeWithError } from '../code'

/**
 * called when a component specific attribute is added on a non-component element
 * @param {Element} node
 * @param {string} attributeName
 * @param {string} compName
 * @returns {Error}
 */

export const component_attribute_used_on_non_component = (node, attributeName, compName) => {

  const nodeName = node.nodeName

  const issue = `\
'${attributeName}' attribute can only be used on a component,
but it is used on a non-component element ${nodeName}`

  const fix = `\
Remove this attribute if ${nodeName} is not a component

If ${nodeName} is actually a component, make sure to declare it in the components() method
`

  const code = getCodeWithError(compName, new RegExp(`/${attributeName}=`))

  return createError(issue, fix, code, compName)

}
