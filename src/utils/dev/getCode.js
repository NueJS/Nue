import { getCompFnLines } from './getCompFnLines'

/**
 * highlight word in code of given component
 * and return the portion of code surrounding code of that word
 * @param {Comp} comp
 * @param {string} word
 * @returns {string}
 */

export const getCode = (comp, word) => {
  let htmlLines = getCompFnLines(comp)
  let matchedIndex = htmlLines.findIndex((htmlLine) => htmlLine.includes(word))

  if (matchedIndex === -1 && comp.parent) {
    htmlLines = getCompFnLines(comp.parent)
    matchedIndex = htmlLines.findIndex((htmlLine) => htmlLine.includes(word))
  }

  if (matchedIndex === -1) return ''

  const codeLines = []

  let startIndex = matchedIndex - 3
  let endIndex = matchedIndex + 4
  startIndex = startIndex < 0 ? 0 : startIndex
  endIndex = endIndex > htmlLines.length - 1 ? htmlLines.length - 1 : endIndex

  let xIndex = 0
  for (let i = startIndex; i < endIndex; i++) {
    const line = htmlLines[i]
    codeLines.push(line)

    if (i === matchedIndex) {
      xIndex = codeLines.length
      const matchedIndex = line.indexOf(word)

      let dashLine = ''
      for (let i = 0; i < matchedIndex; i++) dashLine += ' '
      for (let i = matchedIndex; i < matchedIndex + word.length; i++) dashLine += '-'

      codeLines.push(dashLine)
    }
  }
  console.log(xIndex)

  return codeLines.map((line, index) => {
    let num
    if (xIndex === index) num = '--'
    else if (index > xIndex) num = matchedIndex + index
    else num = matchedIndex + index + 1

    const lineNumber = String(num)
    return lineNumber.padStart(3) + ' |' + line
  }).join('\n')
}
