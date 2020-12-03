import getSlice from './value.js'

/**
 * removes curly braces from string
 * input: "{xxx}" output "xxx"
 * @param {string} str
 */
export const uncurl = str => str.substr(1, str.length - 2)

/**
 * checks the the string is wrapped in braces
 * @param {String} str
 */
export const isCurled = str => str[0] === '[' && str[str.length - 1] === ']'

/**
 * return attribute value of an element
 * return null if the value is null and  optional
 * throw error if value is null and not optional
 * @param {Element} element
 * @param {String} attributeName
 * @param {Boolean} optional
 */
export function attr (element, attributeName, optional) {
  const str = element.getAttribute(attributeName)
  if (!str) {
    if (optional) return null
    else throw new Error(`missing "${attributeName}" attribute on <${element.nodeName}> in <${this.compName}>`)
  }

  return uncurl(str)
}

/**
 * detect the parts of text which are variable which is wrapped in braces {}
 * @param {String} text
 */

export function splitText (text) {
  const parts = []
  let openBracketFound = false
  let str = ''

  for (let i = 0; i < text.length; i++) {
    if (openBracketFound && text[i] !== ']') str += text[i]
    else if (text[i] === '[') {
      openBracketFound = true
      if (str) {
        parts.push({ string: str })
        str = '['
      }
    } else if (openBracketFound && text[i] === ']') {
      const stateChain = str.substr(1).split('.')
      console.log({ stateChain })
      let value
      try {
        value = getSlice(this.$, stateChain)
      } catch {
        console.log('error : ', str)
        // isVariable = false
      }

      if (value === undefined) {
        openBracketFound = false
        console.log(text[i])
        str += text[i]
      } else {
        parts.push({ stateChain, isVariable: true, value })
        openBracketFound = false
        str = '' // reset
      }
    } else {
      str += text[i]
    }
  }

  if (str) parts.push({ string: str })
  return parts
}

export const spaceSplitter = str => str.split(' ').filter(i => i)
