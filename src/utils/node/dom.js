export const attr = (node, name) => node.getAttribute(name)

export const animate = (node, name) => {
  node.style.animation = name
}

export const waitForEvent = async (node, eventName) =>
  new Promise(resolve =>
    node.addEventListener(eventName, resolve, { once: true })
  )

export const onAnimationEnd = (node, cb) => {
  node.addEventListener('animationend', cb, { once: true })
}

export const createElement = (name) => document.createElement(name)
