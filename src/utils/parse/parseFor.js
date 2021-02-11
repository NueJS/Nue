import err from '../dev/error'
import { attr } from '../node/dom'
import processPlaceholder from '../string/placeholder/processPlaceholder'

const parseFor = (node) => {
  const loopInfo = attr(node, ':')
  const [item, items] = loopInfo.split('in')
  const key = attr(node, 'key')

  node.parsed = {}

  const names = ['each', 'of', 'key'];
  [item, items, key].forEach((x, i) => {
    node.parsed[names[i]] = x && processPlaceholder(x, true)
  })

  for (const x of ['reorder', 'enter', 'exit', 'at']) {
    node.parsed[x] = attr(node, x)
  }

  checkForNode(node.parsed)
}

const checkForNode = (parsed) => {
  if (!parsed.each) {
    err({
      message: 'for loop is missing "each" attribute',
      code: 1,
      link: ''
    })
  }

  if (!parsed.of) {
    err({
      message: 'for loop is missing "of" attribute',
      code: 2,
      link: ''
    })
  }

  if (!parsed.key) {
    err({
      message: 'for loop is missing "key" attribute',
      code: 2,
      link: ''
    })
  }
}

export default parseFor
