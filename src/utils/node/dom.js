import { IGNORE_DISCONNECT } from '../constants'

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
  comp[IGNORE_DISCONNECT] = true
  animate(comp, animation, true, () => comp.remove())
}

// run animation on all nodes
// and call onAnimationEnd when last animation is completed
export const animateAll = (nodes, cssAnimation, onLastAnimationEnd) => {
  const lastIndex = nodes.length - 1
  nodes.forEach((comp, i) => {
    animate(comp, cssAnimation, true, () => {
      if (i === lastIndex) onLastAnimationEnd()
    })
  })
}
