import parseIf from './parseIf'
import parseNode from './parseNode'

function parseTemplate (nue) {
  nue.uselessNodes = []
  nue.ifNodes = []
  nue.template.content.childNodes.forEach(n => parseNode(nue, n))
  // run deferred methods
  nue.deferred.forEach(m => m())
  nue.deferred = []
  // remove redundant nodes
  nue.uselessNodes.forEach(n => n.remove())
  parseIf(nue)
}

export default parseTemplate
