import getFn from '../../closure.js'
import { FN, TEXT } from '../../constants.js'
import { targetProp } from '../../state/slice.js'
import { bracketify } from '../bracket.js'

const processFnPlaceholder = (comp, content, str) => {
  const [fnName, argsStr] = content.split('(')
  const fn = getFn(comp, fnName)

  if (fn) {
    const closeParenRemoved = argsStr.substr(0, argsStr.length - 1)
    // array of slices ['user.name', 'age']
    const slices = closeParenRemoved.split(',')
    // array of paths
    const deps = slices.map(a => a.split('.'))

    // memoize targets and props from deps
    // @TODO - this won't work when there are multiple instances of comp
    // use tpMemo
    let tps

    const getValue = (comp) => {
      if (!tps) tps = deps.map(path => targetProp(comp.$, path))
      const values = tps.map(([t, p]) => t[p])
      return fn(...values)
    }

    return {
      type: FN,
      deps,
      getValue,
      text: str
    }
  }

  // forgive errors
  else return { type: TEXT, text: bracketify(str) }
}

export default processFnPlaceholder
