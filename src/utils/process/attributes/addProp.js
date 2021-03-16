import { FN } from '../../constants.js'
import DEV from '../../dev/DEV.js'
import errors from '../../dev/errors.js'
import mutate from '../../state/mutate.js'
import { syncNode } from '../../subscription/node.js'

/**
 * add prop on Element
 * @param {import('../../types').compNode} compNode
 * @param {import('../../types').parsedElement} element
 * @param {import('../../types').attribute} param2
 */
const addProp = (compNode, element, [{ getValue, deps, type, content }, propName]) => {
  const setProp = () => {
    // @ts-ignore
    element[propName] = getValue(compNode)
  }

  if (element.matches('input, textarea')) {
    if (DEV && type === FN) throw errors.INVALID_INPUT_BINDING(compNode.name, content)
    // @ts-ignore
    const isNumber = element.type === 'number' || element.type === 'range'
    const handler = () => {
      // @ts-ignore
      let value = element[propName]
      value = isNumber ? Number(value) : value
      mutate(compNode.$, deps[0], value)
    }

    element.addEventListener('input', handler)
  }

  syncNode(compNode, element, deps, setProp)
}

export default addProp
