import { split } from '../string/split.js'

/**
 * parse text node
 * @param {Text} node
 * @param {Function[]} deferredParsingWork
 * @param {string} compName
 */
export const parseTextNode = (node, deferredParsingWork, compName) => {
  const text = node.textContent || ''
  const trimmedText = text.trim()

  // if the node is only empty string, it will be normalized by DOM, so remove it
  if (!trimmedText) {
    deferredParsingWork.push(() => node.remove())
    return
  }

  const parts = split(text, compName)

  /** @type {Parsed_Text[]} */
  const textNodes = []

  // for each part create a text node
  // if it's not TEXT type, save the part info in parsed.placeholder
  parts.forEach(part => {

    let textNode
    if (typeof part === 'string') {
      textNode = document.createTextNode(part)
    } else {
      const temp = `[${part._content}]`
      textNode = document.createTextNode(temp);
      /** @type {Parsed_Text} */(textNode)._parsedInfo = {
        _placeholder: part
      }
    }

    // @ts-expect-error
    textNodes.push(textNode)
  })

  // replace the original node with new textNodes
  deferredParsingWork.push(() => {
    textNodes.forEach(textNode => node.before(textNode))
    node.remove()
  })
}
