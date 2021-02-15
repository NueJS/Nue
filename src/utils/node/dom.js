
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

export const onAnimationEnd = (node, cb) => {
  node.addEventListener('animationend', cb, { once: true })
}
