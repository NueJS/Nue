import { FN } from '../../constants.js'
import { targetProp } from '../../state/slice.js'
import DEV from '../../dev/DEV'

/**
 * process fn placeholder
 * @param {string} content
 * @returns {import('../../types.js').placeholder}
 */
const processFnPlaceholder = (content) => {
  // 'foo(bar.baz, fizz, buzz)'

  // 'foo(bar.baz, fizz, buzz'
  const closeParenRemoved = content.slice(0, -1)

  // [ 'foo', 'bar.baz, fizz, buzz' ]
  const [fnName, argsStr] = closeParenRemoved.split('(')

  // [ 'bar.baz', 'fizz', 'buzz' ]
  const args = argsStr.split(',')

  // [ ['bar', 'baz'], ['fizz'], ['buzz'] ]
  const deps = args.map(a => a.split('.'))

  // using the deps and comp - get the value of foo(bar.baz, fizz, buzz)
  const getValue = (comp) => {
    const fn = comp.fn[fnName]
    if (DEV && !fn) {
      throw {
        comp,
        message: `invalid method "${fnName}" used in [${content}] placeholder in template`,
        fix: `make sure "${fnName}" method exists in the 'fn' object of <${comp.name}/> or its closure`
      }
    }
    const tps = deps.map(path => targetProp(comp.$, path))
    const values = tps.map(([t, p]) => t[p])
    return fn(...values)
  }

  return {
    type: FN,
    deps,
    getValue,
    content
  }
}

export default processFnPlaceholder
