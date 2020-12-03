// import { uid } from '../others.js'
import { isCurled, uncurl } from '../str.js'
import attrs from './attrs.js'
// import saveNodeInfo from './saveNodeInfo.js'

/**
 * process attributes of node and then memoize them in this.memo.nodes
 * @param {HTMLElement} node
 */
function saveAttributes (node, i) {
  this.memo.nodes[i] = {}
  const saveOn = this.memo.nodes[i]
  saveOn.attributes = []

  const attributes = attrs(node)
  Object.keys(attributes).forEach(atrName => {
    const [attrValue, isVar] = attributes[atrName]
    let attrInfo

    if (isVar) {
      node.removeAttribute(atrName)
    }

    const isShorthand = isCurled(atrName) && attrValue === ''
    if (isShorthand) {
      node.removeAttribute(atrName)
      const unAtName = uncurl(atrName)
      attrInfo = {
        path: [unAtName],
        name: unAtName
      }
    }

    // :propName=[slice] or :propName='value'
    else if (atrName[0] === ':') {
      node.removeAttribute(atrName)
      attrInfo = {
        propName: atrName.substr(1),
        isVar,
        path: isVar ? attrValue.split('.') : attrValue
      }
    }

    else if (isVar) {
      const path = attrValue.split('.')
      // @eventName=[handler]
      if (atrName[0] === '@') {
        const atRemoved = atrName.substr(1)
        attrInfo = {
          handler: attrValue,
          eventName: atRemoved
        }
      }

      // @bind:bindProp=[slice]
      else if (atrName.startsWith('bind:')) {
        const bindProp = atrName.substr(5)
        attrInfo = {
          bindProp,
          path
        }
      }

      // name=[slice] or slice=[slice]'s shorthand -> [slice]
      else {
        attrInfo = {
          path,
          name: atrName
        }
      }
    }

    if (attrInfo) saveOn.attributes.push(attrInfo)
  })
}

export default saveAttributes
