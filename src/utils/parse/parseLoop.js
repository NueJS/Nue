import { ENTER_ANIMATION, EXIT_ANIMATION, FOR_ATTRIBUTE, KEY_ATTRIBUTE, REORDER_TRANSITION } from '../constants'
import DEV from '../dev/DEV'
import { attr } from '../node/dom'
import processPlaceholder from '../string/placeholder/processPlaceholder'
import { checkParsedLoop } from './checkParsed'

const parseLoop = (node, forAttribute, parsingInfo) => {
  // replace ' in ', '(' ')' ',' with space, split with space, and remove empty strings
  const arr = forAttribute.replace(/\(|\)|,|(\sin\s)/g, ' ').split(/\s+/).filter(t => t)
  const atUsed = arr.length === 3

  node.parsed.for = {
    map: processPlaceholder(atUsed ? arr[2] : arr[1], true),
    as: arr[0],
    at: atUsed && arr[1],
    key: processPlaceholder(attr(node, KEY_ATTRIBUTE)),
    enter: attr(node, ENTER_ANIMATION),
    reorder: attr(node, REORDER_TRANSITION),
    exit: attr(node, EXIT_ANIMATION)
  }

  if (DEV) checkParsedLoop(parsingInfo.component, node, arr);

  [EXIT_ANIMATION, ENTER_ANIMATION, REORDER_TRANSITION, FOR_ATTRIBUTE, KEY_ATTRIBUTE].forEach(name => {
    node.removeAttribute(name)
  })
}

export default parseLoop
