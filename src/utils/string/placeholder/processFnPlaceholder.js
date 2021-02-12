import { FN } from '../../constants.js'
import { targetProp } from '../../state/slice.js'
import DEV from '../../dev/DEV'
import err from '../../dev/error.js'

// 'foo(bar.baz, fizz, buzz)'
const processFnPlaceholder = (content) => {
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
      err({
        comp,
        message: `invalid method "${fnName}" used in [${content}] placeholder in template`,
        fix: `make sure "${fnName}" method exists in the 'fn' object of <${comp.name}/> or its closure`
      })
    }
    const tps = deps.map(path => targetProp(comp.$, path))
    const values = tps.map(([t, p]) => t[p])
    return fn(...values)
  }

  return {
    type: FN,
    deps,
    getValue
  }
}

export default processFnPlaceholder
