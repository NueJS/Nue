import errors from '../dev/errors'

export const checkFor = (comp, node, arr) => {
  if (arr.length < 2) {
    throw errors.INVALID_FOR_ATTRIBUTE(comp, node)
  }

  const { key, exit } = node.parsed.for

  if (exit) {
    comp.deferred.push(() => {
      const [animationName] = exit.split(' ')
      const style = comp.template.content.querySelector('style:not([default-styles])')
      // style.textContent
      const styleUsesAnimation = style && style.textContent.includes(animationName)
      if (!styleUsesAnimation) {
        throw errors.EXIT_ANIMATION_NOT_FOUND(comp, animationName, node)
      }
    })
  }

  if (!key) {
    throw errors.MISSING_KEY_ATTRIBUTE(comp, node)
  }
}
