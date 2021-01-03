export const isConditionNode = node =>
  ['IF', 'ELSE-IF', 'ELSE'].includes(node.nodeName)

export const getOffset = (node) => {
  return {
    left: node.offsetLeft,
    top: node.offsetTop
  }
}

export const attr = (node, name) => node.getAttribute(name)

export const animate = (node, name) => {
  node.style.animation = name
}

export const waitForEvent = async (node, eventName) =>
  new Promise(resolve =>
    node.addEventListener(eventName, resolve, { once: true })
  )

export const saveOffsets = (comps) => {
  for (const c of comps) {
    c.prev = getOffset(c)
  }
}
