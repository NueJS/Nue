import { DEFERRED_WORK } from '../constants.js'
import getClone from '../node/clone.js'
import { flushArray } from '../others.js'
import processNode from '../process/processNode.js'

const buildShadowDOM = (compNode, templateNode) => {
  const rootNode = getClone(templateNode.content)

  processNode(compNode, rootNode)
  flushArray(compNode[DEFERRED_WORK])

  // add rootNode to shadow DOM
  compNode.attachShadow({ mode: 'open' });

  // must use spread here even though childNodes is an array
  // because, appending rootNode to shadowRoot, removes it from childNodes array
  [...rootNode.childNodes].forEach(childNode => compNode.shadowRoot.append(childNode))
}

export default buildShadowDOM
