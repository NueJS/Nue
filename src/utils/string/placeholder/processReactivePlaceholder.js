import { REACTIVE } from '../../constants.js'
import { targetProp } from '../../state/slice.js'
import { bracketify } from '../bracket.js'

const processReactivePlaceholder = (content, str, noBrackets = true) => {
  const path = content.split('.')

  // memoize target and prop after getting it for the first time
  // let target, prop
  function getValue (comp) {
    if (!comp.tpMemo[content]) {
      console.log('save')
      comp.tpMemo[content] = targetProp(comp.$, path)
    }
    const [target, prop] = comp.tpMemo[content]
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
