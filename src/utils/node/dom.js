export const isConditionNode = node =>
  ['IF', 'ELSE-IF', 'ELSE'].includes(node.nodeName)
