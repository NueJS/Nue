import mutate from '../../state/mutate.js'
import { syncNode } from '../../subscription/node.js'

/**
 * add prop on Element
 * @param {import('../../types').compNode} compNode
 * @param {Element} node
 * @param {import('../../types').attribute} param2
 */
const addProp = (compNode, node, [{ getValue, deps }, propName]) => {
  const setProp = () => {
    // @ts-ignore
    node[propName] = getValue(compNode)
  }

  if (node.matches('input, textarea')) {
    // @ts-ignore
    const isNumber = node.type === 'number' || node.type === 'range'
    const handler = () => {
      // @ts-ignore
      let value = node[propName]
      value = isNumber ? Number(value) : value
      mutate(compNode.$, deps[0], value)
    }

    node.addEventListener('input', handler)
  }

  syncNode(compNode, node, deps, setProp)
}

export default addProp
