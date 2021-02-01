import processTextNode from './processTextNode.js'
import processAttributes from './attributes/processAttributes.js'
import processIf from './if/if.js'
import { render } from '../../index.js'
import globalInfo from '../globalInfo.js'
import processFor from './for/processFor.js'

function processNode (comp, node) {
  const { sweet } = node
  if (sweet) {
    if (sweet.isProcessed) return
    sweet.isProcessed = true

    if (sweet.isComp) {
      sweet.closure = {
        $: comp.$,
        fn: comp.fn,
        component: comp
      }
      if (!globalInfo.renderedComps[sweet.compName]) render(sweet.compName)
    }

    if (node.nodeType === Node.TEXT_NODE) processTextNode(comp, node)
    else if (node.nodeName === 'IF') processIf(comp, node)
    else if (node.nodeName === 'FOR') processFor(comp, node)

    else if (node.hasAttribute) processAttributes(comp, node)
  }

  if (node.nodeName === 'FOR') return

  if (node.hasChildNodes()) {
    node.childNodes.forEach(n => processNode(comp, n))
  }
}

export default processNode
