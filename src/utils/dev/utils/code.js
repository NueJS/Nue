import { data } from '../../data'

/**
 * return array of lines of codes of given component's function
 * @param {string} compName
 * @return {string[]}
 */

export const getCompClassCode = (compName) => {
  // get the component function
  const compClass = data._definedComponents[compName]
  return compClass.toString().split('\n')
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
 * @param {string} compName
 * @param {RegExp} errorRegex
 * @returns {HTMLElement | undefined}
 */

export const getCodeWithError = (compName, errorRegex) => {
  // get the error line index using the comp's fn
  console.log({ errorRegex })
  const allCodeLines = getCompClassCode(compName)
  const matchLineIndex = getErrorLineIndex(allCodeLines, errorRegex)

  // if not found there, error might be in the slot or on attributes of that comp
  // in that case, error code will be in the parent of the comp
  // if (matchLineIndex === -1 && comp.parent) {
  //   allCodeLines = getCompClassCode(comp.parent._compName)
  //   matchLineIndex = getErrorLineIndex(allCodeLines, errorRegex)
  // }

  // if still can't find it - we need a better errorRegex
  if (matchLineIndex === -1) return undefined

  const code = document.createElement('code')

  // show a total of 9 lines
  const lineCount = 10
  // let startIndex = matchLineIndex - Math.floor(lineCount / 2)
  // let endIndex = matchLineIndex + Math.floor(lineCount / 2)

  // startIndex = startIndex < 1 ? 1 : startIndex
  // endIndex = endIndex > allCodeLines.length - 1 ? allCodeLines.length - 1 : endIndex

  /** @type {RegExpMatchArray}*/
  let regexMatch

  for (let lineIndex = 0; lineIndex < allCodeLines.length; lineIndex++) {
    const line = allCodeLines[lineIndex]

    const errorLine = ['', '', '']
    let hasError = false

    if (lineIndex === matchLineIndex) {
      hasError = true

      regexMatch = /** @type {RegExpMatchArray}*/(line.match(errorRegex))

      const startIndex = /** @type {number}*/(regexMatch.index)
      const endIndex = startIndex + regexMatch[0].length - 1

      for (let i = 0; i < line.length; i++) {
        if (i < startIndex) errorLine[0] += line[i]
        else if (i > endIndex) errorLine[2] += line[i]
        else errorLine[1] += line[i]
      }

    }

    const lineEl = document.createElement('div')
    code.append(lineEl)
    if (!hasError) lineEl.textContent = line
    else {
      const beforeText = document.createTextNode(errorLine[0])
      const afterText = document.createTextNode(errorLine[2])
      const errorText = document.createElement('span')
      errorText.className = 'error'
      errorText.textContent = errorLine[1]

      lineEl.append(beforeText)
      lineEl.append(errorText)
      lineEl.append(afterText)

      lineEl.className = 'has-error'
    }
  }

  return code
}
