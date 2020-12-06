// import saveNodeInfo from './saveNodeInfo.js'
import { unwrap } from '../string/placeholder.js'
import ignore_space from '../string/ignore_space.js'
import { uses_fn, add_fn_deps } from '../string/fn.js'

function memoize_comment (node, memo_id) {
  // console.log(node.nodeName, memo_id)
  this.memo.nodes[memo_id] = {}
  const memo = this.memo.nodes[memo_id]
  const text = node.textContent
  const split = ignore_space(text)

  const memoize_condition = (type) => {
    memo.type = type
    const str = unwrap(split[1])
    // console.log({ str })
    if (uses_fn(str)) {
      const { fn_name, deps, call_fn } = add_fn_deps.call(this, str)
      memo.fn_name = fn_name
      memo.deps = deps
      memo.call_fn = call_fn
    }

    else memo.path = str.split('.')
  }

  switch (split[0]) {
    case 'if': memoize_condition('if'); break
    case 'else-if': memoize_condition('else-if'); break
    case 'else': memo.type = 'else'; break
    case 'end-if': memo.type = 'end-if'; break
    case 'for': {
      memo.type = 'for'
      memo.item = unwrap(split[1])
      memo.loopType = split[2]
      memo.iterable = unwrap(split[3]).split('.')
      if (split[4] === 'at') {
        memo.at = unwrap(split[5])
      }
      break
    }

    case 'end-for': { memo.type = 'end-for'; break }
  }
}

export default memoize_comment
