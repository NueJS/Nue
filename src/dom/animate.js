/**
* remove name attribute from element
* @param {HTMLElement} element
* @param {string} name
* @param {boolean} [clearAnimation]
* @param {Function} [cb]
*/
export const animate = (element, name, clearAnimation = false, cb) => {
  element.style.animation = name
  if (clearAnimation) {
    onAnimationEnd(element, () => {
      element.style.animation = ''
      if (cb) cb()
    })
  }
}

/**
* when animation ends on element run callback
* @param {HTMLElement} element
* @param {() => any} cb
*/
export const onAnimationEnd = (element, cb) => {
  element.addEventListener('animationend', cb, { once: true })
}

/**
 * call disconnectedCallback and then play remove animation
 * @param {Comp} comp
 * @param {string} animation
 */
export const animatedRemove = (comp, animation) => {
  comp.disconnectedCallback()
  comp._manuallyDisconnected = true
  animate(comp, animation, true, () => comp.remove())
}

/**
 * run animation on all elements, and call onAnimationEnd when last animation is completed
 * @param {HTMLElement[]} elements
 * @param {string} cssAnimation
 * @param {Function} onLastAnimationEnd
 */
export const animateAll = (elements, cssAnimation, onLastAnimationEnd) => {
  const lastIndex = elements.length - 1
  elements.forEach((comp, i) => {
    animate(comp, cssAnimation, true, () => {
      if (i === lastIndex) onLastAnimationEnd()
    })
  })
}
