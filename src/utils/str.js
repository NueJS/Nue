// remove curly braces around string
// turn '{xxx}' into 'xxx'
export const uncurl = str => str.substr(1, str.length - 2)

// check if the string is contained in curly braces
// '{xxx}' -> yes '{xx' -> no
export const isCurled = str => str[0] === '{' && str[str.length - 1] === '}'

export const getUncurledAttribute = (node, atrName) => {
  const str = node.getAttribute(atrName)
  return str === null ? null : uncurl(str)
}
