import attrs from './attrs.js'

const uid = () => '' + Math.random()

export function forAllNodesInSubtree (node, cb) {
  cb(node)
  const hasChild = node.childNodes.length > 1
  if (hasChild) {
    node.childNodes.forEach(n => {
      forAllNodesInSubtree(n, cb)
    })
  }
}

function saveAttributeInfo (node) {
  // add here
  const sweetuid = uid()
  node.dataset.sweetuid = sweetuid
  this.config.templateInfo[sweetuid] = { attributes: [] }
  const target = this.config.templateInfo[sweetuid]
  node.sweetuid = sweetuid

  const attributes = attrs(node)
  Object.keys(attributes).forEach(atrName => {
    const [attrValue, isVar] = attributes[atrName]
    let attrInfo
    // if reactive attribute

    // :propName={state.key} or :propName="value"
    if (atrName[0] === ':') {
      attrInfo = {
        propName: atrName[0].substr(1),
        isVar,
        stateChain: isVar ? attrValue.split('.').slice(1) : null
      }
    }

    else if (isVar) {
      const atrValueSplit = attrValue.split('.').slice(1)

      node.removeAttribute(atrName)

      // @xyz={abc}
      if (atrName[0] === '@') {
        const atRemoved = atrName.substr(1)
        const split = atRemoved.split(':')

        if (split.length === 1) { // @eventName={handler}
          attrInfo = {
            handler: attrValue,
            eventName: atRemoved
          }
        } else { // @eventName:targetProp={state.key}
          attrInfo = {
            stateChain: atrValueSplit,
            eventName: split[0],
            targetProp: split[1]
          }
        }
      }

      else {
        attrInfo = {
          stateChain: atrValueSplit,
          name: atrName
        }
      }
    }

    target.attributes.push(attrInfo)
  })
}

// remove empty text nodes
// replace reactive props to dataset

export function processTemplate (template) {
  const removeNodes = []
  forAllNodesInSubtree(template.content, node => {
    // remove empty text nodes
    if (node.nodeName === '#text') {
      if (!node.textContent.trim()) removeNodes.push(node)
    }

    else if (node.attributes && node.attributes.length) {
      saveAttributeInfo.call(this, node)
    }
  })

  removeNodes.forEach(n => n.remove())
}

// remove all the state listener on all child nodes in the tree
// and then remove the node itself
export function removeTree (node) {
  forAllNodesInSubtree(node, target => {
    if (target.removeStateListener) target.removeStateListener()
  })

  node.remove()
}

// add back the state change listeners and then add the node itself
export function addTree (node, anchorNode) {
  forAllNodesInSubtree(node, target => {
    if (target.addStateListener) target.addStateListener()
  })
  anchorNode.after(node)
}
