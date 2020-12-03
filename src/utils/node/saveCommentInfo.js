// import saveNodeInfo from './saveNodeInfo.js'
import { spaceSplitter, uncurl } from '../str.js'

function saveCommentInfo (node, i) {
  // console.log(node.nodeName, i)
  this.memo.nodes[i] = {}
  const saveOn = this.memo.nodes[i]

  const text = node.textContent
  const textArr = spaceSplitter(text)

  const saveChain = (type) => {
    saveOn.type = type
    saveOn.stateChain = uncurl(textArr[1]).split('.')
  }

  switch (textArr[0]) {
    case 'if': saveChain('if'); break
    case 'else-if': saveChain('else-if'); break
    case 'else': saveOn.type = 'else'; break
    case 'end-if': saveOn.type = 'end-if'
  }
}

export default saveCommentInfo
