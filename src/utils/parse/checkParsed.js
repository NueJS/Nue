import err from '../dev/error'

export const checkFor = (comp, node, arr) => {
  if (arr.length < 2) {
    err({
      message: `invalid for attribute value on ${node.nodeName}`,
      code: 1,
      link: ''
    })
  }

  const { key, exit } = node.parsed.for

  if (exit) {
    comp.deferred.push(() => {
      const [animationName] = exit.split(' ')
      const style = comp.memo.template.content.querySelector('style:not([default-styles])')
      // style.textContent
      const styleUsesAnimation = style.textContent.includes(animationName)
      if (!styleUsesAnimation) {
        err({
          message: `exit animation: "${animationName}" used on <${node.parsed.name}> but not defined in CSS. \nThis will result in component never being removed, as nue.js keeps waiting for the animation to end which does not exist`,
          fix: `To fix this: define animation "${animationName}" in CSS using @keyframes`,
          comp,
          code: 'MISSING_EXIT_ANIMATION_IN_CSS'
        })
      }
    })
  }

  if (!key) {
    err({
      message: `missing attribute "key" on ${node.nodeName}.`,
      code: 2,
      link: ''
    })
  }
}
