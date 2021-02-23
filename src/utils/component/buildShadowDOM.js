import getClone from '../node/clone.js'
import { executeAndClear } from '../others.js'
import processNode from '../process/processNode.js'

const buildShadowDOM = (nue) => {
  const { deferred, node } = nue
  const { templateNode } = nue.common

  const fragment = getClone(templateNode.content)

  processNode(nue, fragment)
  executeAndClear(deferred)

  // add fragment to shadow DOM
  node.attachShadow({ mode: 'open' });

  // must use spread here even though childNodes is an array
  // because, appending node to shadowRoot, removes it from childNodes array
  [...fragment.childNodes].forEach(childNode => node.shadowRoot.append(childNode))
}

export default buildShadowDOM
