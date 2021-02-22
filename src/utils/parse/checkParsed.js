import errors from '../dev/errors'

export const checkFor = (nue, node, arr) => {
  if (arr.length < 2) {
    throw errors.INVALID_FOR_ATTRIBUTE(nue.name, node)
  }

  const { key, exit } = node.parsed.for

  if (exit) {
    nue.deferred.push(() => {
      const [animationName] = exit.split(' ')
      const style = nue.template.content.querySelector('style:not([default-styles])')
      // style.textContent
      const styleUsesAnimation = style && style.textContent.includes(animationName)
      if (!styleUsesAnimation) {
        throw errors.EXIT_ANIMATION_NOT_FOUND(nue.name, animationName, node)
      }
    })
  }

  if (!key) {
    throw errors.MISSING_KEY_ATTRIBUTE(nue.name, node)
  }
}
