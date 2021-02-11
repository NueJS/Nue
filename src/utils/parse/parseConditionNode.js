import processPlaceholder from '../string/placeholder/processPlaceholder'

const parseConditionNode = (node) => {
  node.parsed = {
    type: node.nodeName,
    enter: node.getAttribute('enter'),
    exit: node.getAttribute('exit')
  }

  if (node.nodeName !== 'ELSE') {
    const condition = node.getAttribute(':')
    node.parsed.condition = processPlaceholder(condition)
  }
}

export default parseConditionNode
