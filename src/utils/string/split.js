import { errors } from '../dev/errors'
import { processPlaceholder } from './placeholder/processPlaceholder'

/**
 * take the string text and split it into placeholders and strings
 * @param {Comp} comp
 * @param {string} text
 * @returns {SplitPart[]} parts
 */

export const split = (comp, text) => {

  /** @type {SplitPart[]} */
  const parts = []

  let collectingVar = false
  let collectedString = ''
  let i = -1

  /** @param {boolean} cv */
  const reset = (cv) => {
    collectedString = ''
    collectingVar = cv
  }

  while (++i < text.length) {
    const char = text[i]
    const nextChar = text[i + 1]

    // if current char is ! and next [, ignore ! and don't make the
    if (char === '!' && nextChar === '[') {
      collectedString += '['
      i += 1
    }

    else if (char === '[') {
      // save current collected string (if any)
      if (collectedString) parts.push(collectedString)
      reset(true)
    }

    else if (collectingVar && char === ']') {
      // process collected variable and save it in parts
      const part = processPlaceholder(collectedString, true)
      parts.push(part)
      reset(false)
    }

    // keep collecting
    else collectedString += char
  }

  // add the remaining text
  if (collectedString) {
    if (_DEV_ && collectingVar) {
      throw errors.BRACKET_NOT_CLOSED(comp._compFnName, collectedString)
    }

    parts.push(collectedString)
  }
  return parts
}
