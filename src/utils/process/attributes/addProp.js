import mutate from '../../state/mutate.js'
import { syncNode } from '../../subscription/node.js'

// ex: :value=[count]
const bindInput = (compNode, node, [{ getValue, deps }, propName]) => {
  const isNumber = node.type === 'number' || node.type === 'range'

  const updateState = value => {
    mutate(compNode.$, deps[0], value)
  }

  const setProp = () => {
    node[propName] = getValue(compNode)
  }

  const addHandler = (handler) => {
    node.addEventListener('input', handler)
  }

  if (node.matches('input, textarea')) {
    const handler = () => {
      let value = node[propName]
      value = isNumber ? Number(value) : value
      updateState(value)
    }

    addHandler(handler)
  }

  syncNode(compNode, node, deps, setProp)
}

export default bindInput
