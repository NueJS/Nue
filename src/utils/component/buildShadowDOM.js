import { DEFERRED_WORK } from '../constants.js'
import getClone from '../node/clone.js'
import { flushArray } from '../others.js'
import processNode from '../process/processNode.js'

const buildShadowDOM = (compNode, templateNode) => {
  // clone templateNode
  const fragment = getClone(templateNode.content)
  // process nodes
  processNode(compNode, fragment)
  // run deferred work
  flushArray(compNode[DEFERRED_WORK])
  // create shadowRoot
  compNode.attachShadow({ mode: 'open' })
  // add fragment nodes to shadowRoot
  compNode.shadowRoot.append(fragment)
}

export default buildShadowDOM
