import { syncNode } from '../../subscription/node.js'

// ex: :value=[count]
const bindInput = (compNode, node, [{ getValue, deps }, propName]) => {
  const isNumber = node.type === 'number' || node.type === 'range'
  const key = deps[0]
  const updateState = value => {
    compNode.$[key] = value
  }

  const setProp = () => {
    node[propName] = getValue(compNode, node)
  }

  const setText = () => {
    node.textContent = getValue(compNode, node)
  }

  const addHandler = (handler) => {
    const { onMount, onDestroy } = compNode.events
    onMount(() => node.addEventListener('input', handler))
    onDestroy(() => node.removeEventListener('input', handler))
  }

  if (node.matches('[contenteditable]')) {
    const handler = () => updateState(node.textContent)
    addHandler(handler)
    syncNode(compNode, node, deps, setText)
    return // must return
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
