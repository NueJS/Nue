import parseNode from './parseNode'

function parseTemplate (comp) {
  const uselessNodes = []
  comp.memo.template.content.childNodes.forEach(n => parseNode(comp, n, uselessNodes))
  // run deferred methods
  comp.deferred.forEach(m => m())
  comp.deferred = []
  // remove redundant nodes
  uselessNodes.forEach(n => n.remove())
}

export default parseTemplate
