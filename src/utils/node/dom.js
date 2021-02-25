export const attr = (node, name) => node.getAttribute(name)

export const animate = (node, name, clearAnimation = false, cb) => {
  node.style.animation = name
  if (clearAnimation) {
    onAnimationEnd(node, () => {
      node.style.animation = null
      if (cb) cb()
    })
  }
}

export const onAnimationEnd = (node, cb) => {
  node.addEventListener('animationend', cb, { once: true })
}

export const createElement = (name) => document.createElement(name)
export const createComment = (text) => document.createComment(text)

export const animatedRemove = (comp, animation) => {
  comp.disconnectedCallback()
  comp.ignoreDisconnect = true
  animate(comp, animation, true, () => comp.remove())
}
