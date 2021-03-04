import { REACTIVE } from '../../constants.js'
import DEV from '../../dev/DEV.js'
import errors from '../../dev/errors.js'
import { isDefined } from '../../others.js'
import { targetProp } from '../../state/slice.js'

const processReactivePlaceholder = (content) => {
  const path = content.split('.')

  // return the value of placeholder in given component
  // @TODO clean this up
  const getValue = (compNode, closure) => {
    const state = compNode.$

    const getValueFrom = (source) => {
      if (!source) return
      const [target, prop] = targetProp(source, path)
      if (target) return target[prop]
    }
    // check in closure first
    const valueFromClosure = getValueFrom(closure)
    if (isDefined(valueFromClosure)) return valueFromClosure
    // else
    const valueFromState = getValueFrom(state)
    if (isDefined(valueFromState)) return valueFromState
    // if not found in both of them, throw
    if (DEV) throw errors.STATE_NOT_FOUND(compNode.name, content)
  }

  return {
    type: REACTIVE,
    getValue,
    deps: [path],
    content
  }
}

export default processReactivePlaceholder
