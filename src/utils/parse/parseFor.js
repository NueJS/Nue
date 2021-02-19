import DEV from '../dev/DEV'
import { attr } from '../node/dom'
import processPlaceholder from '../string/placeholder/processPlaceholder'
import { checkFor } from './checkParsed'

const parseFor = (comp, node, forAttribute) => {
  // replace ' in ', '(' ')' ',' with space, split with space, and remove empty strings
  const arr = forAttribute.replace(/\(|\)|,|(\sin\s)/g, ' ').split(/\s+/).filter(t => t)
  const atUsed = arr.length === 3

  node.parsed.for = {
    map: processPlaceholder(atUsed ? arr[2] : arr[1], true),
    as: arr[0],
    at: atUsed && arr[1],
    key: processPlaceholder(attr(node, 'key')),
    enter: attr(node, 'enter'),
    reorder: attr(node, 'reorder'),
    exit: attr(node, 'exit')
  };

  ['exit', 'enter', 'reorder', 'for', 'key'].forEach(name => {
    node.removeAttribute(name)
  })

  if (DEV) checkFor(comp, node, arr)
}

export default parseFor
