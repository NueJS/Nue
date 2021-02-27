import { KEY_ATTRIBUTE } from '../constants'
import errors from '../dev/errors'
import { attr } from '../node/dom'
import { isBracketed } from '../string/bracket'

export const checkParsedLoop = (component, node, arr) => {
  if (arr.length < 2) {
    throw errors.INVALID_FOR_ATTRIBUTE(component.name, node)
  }

  const { key, exit } = node.parsed.for

  // if exit animation is specified, but not defined in style, throw error
  if (exit) {
    const [animationName] = exit.split(' ')
    const style = component.style

    // if no style is added or if style is used but animationName not used in style
    // @todo use styleNode.sheet.cssRules and find if there is any animation by that name exits or not
    if (!style || !style.includes(animationName)) {
      throw errors.EXIT_ANIMATION_NOT_FOUND(component.name, animationName, node)
    }
  }

  if (!key) {
    throw errors.MISSING_KEY_ATTRIBUTE(component.name, node)
  }

  else {
    if (!isBracketed(attr(node, KEY_ATTRIBUTE))) throw errors.KEY_NOT_BRACKETED(component.name, node, key)
  }
}
