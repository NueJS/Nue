import processTextContent from './processTextContent.js'
// import processMapping from './processMapping.js'
// import processIf from './processIf.js'
import processAttributes from './processAttributes.js'
import onStateChange from '../reactivity/onStateChange.js'
import attrs from '../attrs.js'
import { uncurl } from '../str.js'
import getSlice from '../value.js'

// function fragify (wrapper) {
//   // place childNodes in document fragment
//   const docFrag = document.createDocumentFragment()
//   while (wrapper.firstChild) {
//     const child = wrapper.removeChild(wrapper.firstChild)
//     docFrag.appendChild(child)
//   }

//   // replace wrapper with document fragment
//   wrapper.parentNode.replaceChild(docFrag, wrapper)
// }

function forAllChildren (node, cb) {
  if (!node.hasChildNodes()) cb(node)
  else {
    node.childNodes.forEach(n => forAllChildren(n, cb))
  }
}

window.forAllChildren = forAllChildren

function processIf (type, node, context) {
  // anchor node is used when adding the nodes
  const anchor = node.previousSibling

  // get all the childNodes in if/else
  const childNodes = [...node.childNodes]
  childNodes.forEach(n => processNode.call(this, n, context))

  let conditionName, stateChain, requiredValue

  if (type === 'if') {
    // get the state chain of condition
    conditionName = node.attributes[0].name
    stateChain = uncurl(node.attributes[0].name).split('.').slice(1)
    requiredValue = true
    this.conditions[conditionName] = {
      ifNodes: childNodes,
      stateChain
    }

    // save this if as last condition so that else following it can use it
    this.lastCondition = conditionName
  }
  if (type === 'else') {
    conditionName = this.lastCondition
    stateChain = this.conditions[conditionName].stateChain
    requiredValue = false
  }

  node.replaceWith(...childNodes)

  const hideOrShow = () => {
    const conditionValue = getSlice(this.state, stateChain)

    if (requiredValue !== conditionValue) {
      childNodes.forEach(n => {
        forAllChildren(n, target => {
          if (target.removeStateListener) {
            // console.log('remove listeners of', target)
            target.removeStateListener()
          }
        })

        n.remove()
      })
    } else {
      childNodes.forEach(n => {
        forAllChildren(n, target => {
          if (target.addStateListener) {
            // console.log('add listeners of', target)
            target.addStateListener()
          }
        })
        anchor.before(n)
      })
    }
  }

  hideOrShow()
  onStateChange.call(this, stateChain, () => {
    hideOrShow()
  })
}

function processNode (node, context) {
  if (node.nodeName === 'STYLE') return

  if (node.nodeName === 'IF') processIf.call(this, 'if', node, context)
  if (node.nodeName === 'ELSE') processIf.call(this, 'else', node, context)

  if (node.nodeName === '#text') {
    processTextContent.call(this, node, context)
    return
  }

  if (node.nodeName === 'TEMPLATE') {
    // processMapping.call(this, node, context)
    // processIf.call(this, node, context)
    return
  }

  processAttributes.call(this, node, context)
  if (node.childNodes.length > 1) [...node.childNodes].forEach(n => processNode.call(this, n, context))
  else processTextContent.call(this, node, context)
}

export default processNode
