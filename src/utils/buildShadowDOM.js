import copyParsed from './node/copyParsed.js'
import processNode from './process/processNode.js'

const buildShadowDOM = (nue) => {
  const { deferred, node } = nue
  const { templateNode } = nue.common

  // create clone of template
  const fragment = templateNode.content.cloneNode(true)

  // add parsed property on fragment
  copyParsed(templateNode.content, fragment)

  // process nodes using parsed property
  processNode(nue, fragment)
  deferred.forEach(p => p())
  deferred.length = 0

  // add fragment to shadow DOM
  node.attachShadow({ mode: 'open' });

  // must use spread here even though childNodes is an array
  // because, appending node to shadowRoot, removes it from childNodes array
  [...fragment.childNodes].forEach(childNode => node.shadowRoot.append(childNode))
}

export default buildShadowDOM
