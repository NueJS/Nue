// import saveNodeInfo from './saveNodeInfo.js'
import { unwrap } from '../string/placeholder.js'
import ignore_space from '../string/ignore_space.js'

function memoize_comment (node, i) {
  this.memo.nodes[i] = {}
  const saveOn = this.memo.nodes[i]

  const text = node.textContent
  const textArr = ignore_space(text)

  const saveChain = (type) => {
    saveOn.type = type
    saveOn.path = unwrap(textArr[1]).split('.')
  }

  switch (textArr[0]) {
    case 'if': saveChain('if'); break
    case 'else-if': saveChain('else-if'); break
    case 'else': saveOn.type = 'else'; break
    case 'end-if': saveOn.type = 'end-if'
  }
}

export default memoize_comment
