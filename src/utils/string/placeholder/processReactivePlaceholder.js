import { REACTIVE } from '../../constants.js'
import DEV from '../../dev/DEV.js'
import errors from '../../dev/errors.js'
import { isDefined } from '../../others.js'
import { targetProp } from '../../state/slice.js'

const processReactivePlaceholder = (content) => {
  const path = content.split('.')

  // return the value of placeholder in given component
  // @TODO clean this up
  const getValue = (compNode) => {
    if (DEV) {
      try {
        const [target, prop] = targetProp(compNode.$, path)
        const value = target[prop]
        if (!isDefined(value)) throw value
        else return value
      } catch (e) {
        throw errors.STATE_NOT_FOUND(compNode.name, content)
      }
    } else {
      const [target, prop] = targetProp(compNode.$, path)
      return target[prop]
    }
  }

  return {
    type: REACTIVE,
    getValue,
    deps: [path],
    content
  }
}

export default processReactivePlaceholder
