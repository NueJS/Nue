import { mutate } from '../../reactivity/mutate.js'
import wire from '../../connection/wire.js'

// ex: :value=[count]
function bindInput (comp, node, attribute) {
  const isNumber = node.type === 'number' || node.type === 'range'
  const { getValue, deps } = attribute.placeholder
  const { name } = attribute

  const setProp = () => {
    node[name] = getValue(comp.$, node)
  }

  const setText = () => {
    node.textContent = getValue(comp.$, node)
  }

  const addHandler = (handler) => {
    const { onMount, onDestroy } = comp.events
    onMount(() => node.addEventListener('input', handler))
    onDestroy(() => node.removeEventListener('input', handler))
  }

  if (node.matches('[contenteditable]')) {
    const handler = () => mutate(comp.$, deps[0], node.textContent)
    addHandler(handler)
    wire(comp, node, deps, setText)
    return // must return
  }

  if (node.matches('input, textarea')) {
    const handler = () => {
      let value = node[name]
      value = isNumber ? Number(value) : value
      mutate(comp.$, deps[0], value)
    }

    addHandler(handler)
  }

  wire(comp, node, deps, setProp)
}

export default bindInput
