import { errors } from '../../dev/errors/index.js'
import { placeholderTypes } from '../../enums'
import { isDefined } from '../../others'
import { getTargetProp } from '../../state/getTargetProp'

/**
 * process fn placeholder
 * @param {string} _content
 * @param {string} _text
 * @returns {Placeholder}
 */
export const processFnPlaceholder = (_content, _text) => {
  // 'foo(bar.baz, fizz, buzz)'

  // 'foo(bar.baz, fizz, buzz'
  const closeParenRemoved = _content.slice(0, -1)

  // [ 'foo', 'bar.baz, fizz, buzz' ]
  const [fnName, argsStr] = closeParenRemoved.split('(')

  // [ 'bar.baz', 'fizz', 'buzz' ]
  const args = argsStr.split(',')

  // [ ['bar', 'baz'], ['fizz'], ['buzz'] ]
  const _statePaths = args.map(a => a.split('.'))

  /**
   * get the value of function placeholder
   * @param {Comp} comp
   * @returns {any}
   */
  const _getValue = (comp) => {
    const fn = comp.fn[fnName]
    // @todo move this to errors
    if (_DEV_ && !fn) {
      throw errors.function_not_found(comp._compName, fnName)
    }
    const tps = _statePaths.map(path => getTargetProp(comp.$, path))
    const values = tps.map(([t, p]) => t[p])

    if (_DEV_) {
      values.forEach((value, i) => {
        if (!isDefined(value)) throw errors.invalid_fn_placeholder(comp._compName, args[i], _content)
      })
    }

    return fn(...values)
  }

  return {
    _type: placeholderTypes._functional,
    _statePaths,
    _getValue,
    _content,
    _text
  }
}
