import { disconnect } from '../../../connection/recursive'
import DEV from '../../../dev/DEV'
import errors from '../../../dev/errors'
import { isConditionNode, onAnimationEnd } from '../../../node/dom'
// import removeGroup from './removeGroup'

const createGroup = (comp, conditionNode) => {
  const { type, enter, exit, condition } = conditionNode.sweet

  const anchorNode = document.createComment('')
  const onRemove = (cb) => onAnimationEnd(lastNode, cb)
  const nodes = []
  let isSatisfied

  // set isSatisfied method and anchorNode textContent
  if (type !== 'ELSE') {
    const { getValue, text } = condition
    isSatisfied = () => getValue(comp)

    if (DEV) {
      anchorNode.textContent = ` ${type} := ${text} ❌ `
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
      if (node.sweet) node.sweet.isProcessed = true
    }
  })

  const lastNode = nodes[nodes.length - 1]

  const group = {
    conditionNode,
    nodes,
    isRendered: false,
    isProcessed: false,
    disconnect: () => nodes.forEach(disconnect),
    enter,
    exit,
    anchorNode,
    onRemove,
    deps: condition && condition.deps,
    isSatisfied,
    lastNode: nodes[nodes.length - 1]
  }

  return group
}

export default createGroup
