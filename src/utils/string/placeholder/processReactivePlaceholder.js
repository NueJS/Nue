import { REACTIVE } from '../../constants.js'
// import DEV from '../../dev/DEV.js'
// import err from '../../dev/error.js'
import { targetProp } from '../../state/slice.js'

const processReactivePlaceholder = (content) => {
  const path = content.split('.')

  // return the value of placeholder in given component
  const getValue = (comp) => {
    const [target, prop] = targetProp(comp.$, path)
    return target[prop]
  }

  return {
    type: REACTIVE,
    getValue,
    deps: [path]
  }
}

export default processReactivePlaceholder
