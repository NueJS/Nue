import { REACTIVE } from '../../constants.js'
import { targetProp } from '../../state/slice.js'
import { bracketify } from '../bracket.js'

const processReactivePlaceholder = (comp, content, str, noBrackets = true) => {
  const path = content.split('.')

  // memoize target and prop after getting it for the first time
  // let target, prop
  function getValue () {
    if (!comp.tpMemo[content]) {
      comp.tpMemo = targetProp(comp.$, path)
    }
    const [target, prop] = comp.tpMemo
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
