// if element has animate attribute, add exit attribute
// when the animation ends, remove the exit attribute and call the cb
// else call it directly

export const animate_exit = (el, cb) => {
  if (el.hasAttribute('animate')) {
    el.setAttribute('exit', '')
    const on_animation_end = () => {
      cb()
      el.removeAttribute('exit')
    }
    el.addEventListener('animationend', on_animation_end, { once: true })
  }
  else cb()
}

// if the node as animate attribute, add 'enter' attribute
// and when the animation ends, remove the enter attribute

export function animate_enter (el) {
  if (el.hasAttribute('animate')) {
    el.setAttribute('enter', '')
    const on_animation_end = () => el.removeAttribute('enter')
    el.addEventListener('animationend', on_animation_end, { once: true })
  }
}
