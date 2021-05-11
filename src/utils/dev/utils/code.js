import { data } from '../../data'

/**
 * return array of lines of codes of given component's function
 * @param {Comp} comp
 * @return {string[]}
 */

export const getCompFnLines = (comp) => {
  // get the component function
  const compFn = data._definedComponents[comp._compFnName]
  // return array of lines of that function's code
  return compFn.toString().split('\n')
}

/**
 * return the index of line which is having the error
 * line which is having the error will have a match for given regex
 * @param {string[]} codeLines
 * @param {RegExp} errorRegex
 * @returns {number}
 */
const getErrorLineIndex = (codeLines, errorRegex) => codeLines.findIndex((codeLine) => {
  const match = codeLine.match(errorRegex)
  return match !== null
})

/**
 * highlight word in code of given component
 * and return the portion of code surrounding code of that word
 * @param {Comp} comp
 * @param {RegExp} errorRegex
 * @returns {string}
 */

export const getCodeWithError = (comp, errorRegex) => {
  // get the error line index using the comp's fn
  let allCodeLines = getCompFnLines(comp)
  let matchLineIndex = getErrorLineIndex(allCodeLines, errorRegex)

  // if not found there, error might be in the slot or on attributes of that comp
  // in that case, error code will be in the parent of the comp
  if (matchLineIndex === -1 && comp.parent) {
    allCodeLines = getCompFnLines(comp.parent)
    matchLineIndex = getErrorLineIndex(allCodeLines, errorRegex)
  }

  // if still can't find it - we need a better errorRegex
  if (matchLineIndex === -1) return ''

  const codeLines = []

  let startIndex = matchLineIndex - 3
  let endIndex = matchLineIndex + 4
  startIndex = startIndex < 1 ? 1 : startIndex
  endIndex = endIndex > allCodeLines.length - 1 ? allCodeLines.length - 1 : endIndex

  let matchLineIndexInPartialCode = 0

  /** @type {RegExpMatchArray}*/
  let regexMatch

  for (let i = startIndex; i < endIndex; i++) {
    const line = allCodeLines[i]
    codeLines.push(line)

    if (i === matchLineIndex) {
      matchLineIndexInPartialCode = codeLines.length
      regexMatch = /** @type {RegExpMatchArray}*/(line.match(errorRegex))

      let dashLine = ''
      for (let i = 0; i < /** @type {number}*/(regexMatch.index); i++) dashLine += ' '
      for (let i = matchLineIndex; i < matchLineIndex + regexMatch[0].length; i++) dashLine += '─'

      codeLines.push(dashLine)
    }
  }

  return codeLines.map((line, lineIndex) => {
    let num
    if (matchLineIndexInPartialCode === lineIndex) num = '──'
    else if (lineIndex === matchLineIndexInPartialCode - 1) num = 'x'
    else if (lineIndex > matchLineIndexInPartialCode) num = lineIndex - matchLineIndexInPartialCode
    else num = lineIndex - matchLineIndexInPartialCode + 1

    const lineNumber = String(num)
    return lineNumber.padStart(3) + ' | ' + line
  }).join('\n')
}
