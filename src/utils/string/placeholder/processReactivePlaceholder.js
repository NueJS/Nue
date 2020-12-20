import { REACTIVE } from '../../constants.js'
import { targetProp } from '../../state/slice.js'
import { bracketify } from '../bracket.js'

const processReactivePlaceholder = (content, str, noBrackets) => {
  const path = content.split('.')

  // memoize target and prop after getting it for the first time
  // let target, prop
  function getValue () {
    if (!this.tpMemo[content]) {
      this.tpMemo = targetProp(this.$, path)
    }
    const [target, prop] = this.tpMemo
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
