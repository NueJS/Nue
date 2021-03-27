import { placeholderTypes } from 'enums.js'
import { targetProp } from '../../state/slice.js'

/**
 * process fn placeholder
 * @param {string} _content
 * @returns {Placeholder}
 */
export const processFnPlaceholder = (_content) => {
  // 'foo(bar.baz, fizz, buzz)'

  // 'foo(bar.baz, fizz, buzz'
  const closeParenRemoved = _content.slice(0, -1)

  // [ 'foo', 'bar.baz, fizz, buzz' ]
  const [fnName, argsStr] = closeParenRemoved.split('(')

  // [ 'bar.baz', 'fizz', 'buzz' ]
  const args = argsStr.split(',')

  // [ ['bar', 'baz'], ['fizz'], ['buzz'] ]
  const _stateDeps = args.map(a => a.split('.'))

  /**
   * get the value of function placeholder
   * @param {Comp} comp
   * @returns {any}
   */
  const _getValue = (comp) => {
    const fn = comp.fn[fnName]
    // @todo move this to errors
    if (_DEV_ && !fn) {
      throw {
        compName: comp._compFnName,
        message: `invalid method "${fnName}" used in [${_content}] placeholder in template`,
        fix: `make sure "${fnName}" method exists in the 'fn' object of <${comp._compFnName}/> or its closure`
      }
    }
    const tps = _stateDeps.map(path => targetProp(comp.$, path))
    const values = tps.map(([t, p]) => t[p])
    return fn(...values)
  }

  return {
    _type: placeholderTypes._functional,
    _stateDeps,
    _getValue,
    _content
  }
}
