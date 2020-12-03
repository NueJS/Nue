// import { uid } from '../others.js'
import attrs from './attrs.js'
// import saveNodeInfo from './saveNodeInfo.js'

/**
 * process attributes of node and then memoize them in this.config.templateInfo
 * @param {HTMLElement} node
 */
function saveAttributes (node, i) {
  // console.log(node.nodeName, i, node.textContent)
  this.config.templateInfo[i] = {}
  const saveOn = this.config.templateInfo[i]
  saveOn.attributes = []
  // console.log('save attributes for a node on', i)

  const attributes = attrs(node)
  Object.keys(attributes).forEach(atrName => {
    const [attrValue, isVar] = attributes[atrName]
    let attrInfo

    if (isVar) {
      node.removeAttribute(atrName)
    }

    // :propName={$.key} or :propName="value"
    if (atrName[0] === ':') {
      node.removeAttribute(atrName)
      attrInfo = {
        propName: atrName.substr(1),
        isVar,
        stateChain: isVar ? attrValue.split('.') : attrValue
      }
    }

    else if (isVar) {
      const stateChain = attrValue.split('.')
      // @eventName={handler}
      if (atrName[0] === '@') {
        const atRemoved = atrName.substr(1)
        attrInfo = {
          handler: attrValue,
          eventName: atRemoved
        }
      }

      // @bind:bindProp={$.key}
      else if (atrName.startsWith('bind:')) {
        const bindProp = atrName.substr(5)
        attrInfo = {
          bindProp,
          stateChain
        }
      }

      // name={$.key}
      else {
        attrInfo = {
          stateChain,
          name: atrName
        }
      }
    }

    if (attrInfo) saveOn.attributes.push(attrInfo)
  })
}

export default saveAttributes
