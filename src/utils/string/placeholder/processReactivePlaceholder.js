import { REACTIVE } from '../../constants.js'
import { targetProp } from '../../state/slice.js'

const processReactivePlaceholder = (content) => {
  const path = content.split('.')

  // return the value of placeholder in given component
  // @TODO clean this up
  const getValue = (state, closure) => {
    if (!closure) {
      const [target, prop] = targetProp(state, path)
      return target[prop]
    } else {
      const [target, prop] = targetProp(closure, path)
      if (target && prop in target) return target[prop]
      else {
        // console.log('get value from closure : ', path)
        const [target, prop] = targetProp(state, path)
        return target[prop]
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
