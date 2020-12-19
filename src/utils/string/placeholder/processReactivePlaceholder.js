import { REACTIVE } from '../../constants.js'
import { targetProp } from '../../state/slice.js'
import { bracketify } from '../bracket.js'

const processReactivePlaceholder = (content, str) => {
  const path = content.split('.')

  // memoize target and prop after getting it for the first time
  let target, prop
  function getValue () {
    if (!target) [target, prop] = targetProp(this.$, path)
    return target[prop]
  }

  return {
    type: REACTIVE,
    getValue,
    deps: [path],
    text: bracketify(str)
  }
}

export default processReactivePlaceholder
