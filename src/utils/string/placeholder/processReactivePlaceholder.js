import { REACTIVE } from '../../constants.js'
import DEV from '../../dev/DEV.js'
import errors from '../../dev/errors.js'
import { isDefined } from '../../others.js'
import { targetProp } from '../../state/slice.js'

const processReactivePlaceholder = (content) => {
  const path = content.split('.')

  // return the value of placeholder in given component
  // @TODO clean this up
  const getValue = (nue, closure) => {
    const state = nue.$
    if (!closure) {
      const [target, prop] = targetProp(state, path)
      return target[prop]
    } else {
      const [target, prop] = targetProp(closure, path)
      const value = target[prop]
      if (target && isDefined(value)) return value
      else {
        const [target, prop] = targetProp(state, path)
        const value = target[prop]
        if (target && isDefined(value)) return value
        else if (DEV) throw errors.STATE_NOT_FOUND(nue.name, content)
      }
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
