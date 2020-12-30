import { REACTIVE } from '../../constants.js'
import { targetProp } from '../../state/slice.js'
import { bracketify } from '../bracket.js'

const processReactivePlaceholder = (content, str, noBrackets = true) => {
  const path = content.split('.')

  // memoize target and prop after getting it for the first time
  // let target, prop
  function getValue (comp) {
    const [target, prop] = targetProp(comp.$, path)
    return target[prop]
  }

  return {
    type: REACTIVE,
    getValue,
    deps: [path],
    text: noBrackets ? bracketify(str) : str,
    content
  }
}

export default processReactivePlaceholder
