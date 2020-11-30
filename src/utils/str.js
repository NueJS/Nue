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
export const isCurled = str => str[0] === '{' && str[str.length - 1] === '}'

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
    if (openBracketFound && text[i] !== '}') str += text[i]
    else if (text[i] === '{') {
      openBracketFound = true
      if (str) {
        parts.push({ string: str })
        str = ''
      }
    } else if (openBracketFound && text[i] === '}') {
      parts.push({ string: str, isVariable: true })
      openBracketFound = false
      str = '' // reset
    } else {
      str += text[i]
    }
  }

  if (openBracketFound) throw new Error(`"{" not closed in ${this.nodeName} either escape it using \\{ or add a closing bracket`)
  if (str) parts.push({ string: str })
  return parts
}
