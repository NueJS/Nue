// remove curly braces around string
// turn '{xxx}' into 'xxx'
export const uncurl = str => str.substr(1, str.length - 2)

// check if the string is contained in curly braces
// '{xxx}' -> yes '{xx' -> no
export const isCurled = str => str[0] === '{' && str[str.length - 1] === '}'

export function attr (node, atrName, optional) {
  const str = node.getAttribute(atrName)
  if (!str) {
    if (optional) return null
    else throw new Error(`missing "${atrName}" attribute on <${node.nodeName}> in <${this.compName}>`)
  }

  return uncurl(str)
}

export function splitText (text) {
  const arr = []
  let openBracketFound = false
  let str = ''

  for (let i = 0; i < text.length; i++) {
    if (openBracketFound && text[i] !== '}') str += text[i]
    else if (text[i] === '{') {
      openBracketFound = true
      if (str) {
        arr.push({ string: str })
        str = ''
      }
    } else if (openBracketFound && text[i] === '}') {
      arr.push({ string: str, isVariable: true })
      openBracketFound = false
      str = '' // reset accumulator
    } else {
      str += text[i]
    }
  }

  if (str) arr.push({ string: str })
  return arr
}
