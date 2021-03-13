import { DEFERRED_WORK } from '../constants.js'
import getClone from '../node/clone.js'
import { flushArray } from '../others.js'
import processNode from '../process/processNode.js'

/**
 * process templateNode and add it in shadowDOM of compNode
 * @param {import('../types').compNode} compNode
 * @param {Element} templateNode
 */
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
  // @ts-ignore (shadowRoot will not be null because mode is open)
  compNode.shadowRoot.append(fragment)
}

export default buildShadowDOM
