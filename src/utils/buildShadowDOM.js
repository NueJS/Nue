import copyParsed from './node/copyParsed.js'
import processNode from './process/processNode.js'

const buildShadowDOM = (nue) => {
  const { template } = nue

  // create clone of template
  const fragment = template.content.cloneNode(true)

  // add parsed property on fragment
  copyParsed(template.content, fragment)

  // process nodes using parsed property
  processNode(nue, fragment)
  nue.deferred.forEach(p => p())
  nue.deferred = []

  // add fragment to shadow DOM
  nue.node.attachShadow({ mode: 'open' });

  // must use spread here even though childNodes is an array
  // because, appending node to shadowRoot, removes it from childNodes array
  [...fragment.childNodes].forEach(node => nue.node.shadowRoot.append(node))
}

export default buildShadowDOM
