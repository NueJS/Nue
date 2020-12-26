import sweetify from './node/sweetify.js'
import processNode from './process/processNode.js'

function buildShadowDOM (comp, template) {
  // create clone of template
  const fragment = template.content.cloneNode(true)

  // add sweet property on nodes
  sweetify(template.content, fragment)

  // process nodes using sweet property
  processNode(comp, fragment)

  // perform fragment modification which is part of processing
  comp.delayedProcesses.forEach(p => p())

  // add fragment to shadow DOM
  comp.attachShadow({ mode: comp.memo.mode });

  // must use spread here even though childNodes is an array
  // because, appending node to shadowRoot, removes it from childNodes array
  [...fragment.childNodes].forEach(node => comp.shadowRoot.append(node))
}

export default buildShadowDOM
