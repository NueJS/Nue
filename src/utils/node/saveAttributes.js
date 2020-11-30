import { uid } from '../others.js'
import attrs from './attrs.js'

/**
 * process attributes of node and then memoize them in this.config.templateInfo
 * @param {HTMLElement} node
 */
function saveAttributes (node) {
  // add here
  const sweetuid = uid()
  node.dataset.sweetuid = sweetuid
  this.config.templateInfo[sweetuid] = { attributes: [] }
  const target = this.config.templateInfo[sweetuid]

  const attributes = attrs(node)
  Object.keys(attributes).forEach(atrName => {
    const [attrValue, isVar] = attributes[atrName]
    let attrInfo

    // :propName={state.key} or :propName="value"
    if (atrName[0] === ':') {
      attrInfo = {
        propName: atrName[0].substr(1),
        isVar,
        stateChain: isVar ? attrValue.split('.') : null
      }
    }

    else if (isVar) {
      node.removeAttribute(atrName)
      const stateChain = attrValue.split('.')

      // @eventName={handler}
      if (atrName[0] === '@') {
        const atRemoved = atrName.substr(1)
        attrInfo = {
          handler: attrValue,
          eventName: atRemoved
        }
      }

      // @bind:bindProp={state.key}
      else if (atrName.startsWith('bind:')) {
        const bindProp = atrName.substr(5)
        attrInfo = {
          bindProp,
          stateChain
        }
      }

      // name={state.key}
      else {
        attrInfo = {
          stateChain,
          name: atrName
        }
      }
    }

    if (attrInfo) target.attributes.push(attrInfo)
  })
}

export default saveAttributes
