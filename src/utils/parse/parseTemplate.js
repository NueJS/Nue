import parseIf from './parseIf'
import parseNode from './parseNode'

function parseTemplate (comp) {
  comp.uselessNodes = []
  comp.ifNodes = []
  comp.template.content.childNodes.forEach(n => parseNode(comp, n))
  // run deferred methods
  comp.deferred.forEach(m => m())
  comp.deferred = []
  // remove redundant nodes
  comp.uselessNodes.forEach(n => n.remove())
  parseIf(comp)
}

export default parseTemplate
