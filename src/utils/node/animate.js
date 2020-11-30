/**
 * if element has animate attribute, add exit attribute
 * - when the animation ends, remove the exit attribute and call the cb
 * else call it directly
 * @param {Element} el - element which will be removed from DOM
 * @param {Function} cb - callback which removes the element
 */

export const handleAnimateExit = (el, cb) => {
  if (el.getAttribute('animate') !== null) {
    el.setAttribute('exit', '')
    el.addEventListener('animationend', () => {
      cb()
      el.removeAttribute('exit')
    }, { once: true })
  }
  else cb()
}

/**
 * if the node as animate attribute, add 'enter' attribute
 * and when the animation ends, remove the enter attribute
 * @param {Element} el - element which is added in DOM
 */

export function handleAnimateEnter (el) {
  if (el.getAttribute('animate') !== null) {
    el.setAttribute('enter', '')
    const onAnimationEnd = () => {
      el.removeAttribute('enter')
    }
    el.addEventListener('animationend', onAnimationEnd, { once: true })
  }
}
