import DEV from '../../../dev/DEV'
import errors from '../../../dev/errors'
import { isConditionNode, onAnimationEnd } from '../../../node/dom'

const createGroup = (comp, conditionNode) => {
  const { type, enter, exit, condition } = conditionNode.parsed

  const anchorNode = document.createComment(type)
  const onRemove = (cb) => onAnimationEnd(lastNode, cb)
  const nodes = []
  let isSatisfied

  // set isSatisfied method and anchorNode textContent
  if (type !== 'ELSE') {
    const { getValue, content } = condition
    isSatisfied = () => getValue(comp)

    if (DEV) {
      anchorNode.textContent = ` ${type} := [${content}] ❌ `
    }
  }

  else {
    isSatisfied = () => true

    if (DEV) {
      anchorNode.textContent = ` ${type} ❌ `
    }
  }

  // create nodes array
  // mark all nodes as processed
  conditionNode.childNodes.forEach(node => {
    if (!isConditionNode(node)) {
      // make sure node is not textNode
      if (DEV) {
        if (node.nodeType === Node.TEXT_NODE) {
          errors.TEXTNODE_DIRECT_CHILD_OF_IF(comp, node)
        }
      }

      nodes.push(node)

      // mark it as processed
      if (node.parsed) node.parsed.isProcessed = true
    }
  })

  const lastNode = nodes[nodes.length - 1]

  const group = {
    // conditionNode,
    nodes,
    isRendered: false,
    isProcessed: false,
    enter,
    exit,
    anchorNode,
    onRemove,
    deps: condition && condition.deps,
    isSatisfied,
    lastNode: nodes[nodes.length - 1],
    comp
  }

  return group
}

export default createGroup
