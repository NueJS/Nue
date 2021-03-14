import { unBracket } from '../bracket.js'
import processFnPlaceholder from './processFnPlaceholder.js'
import processReactivePlaceholder from './processReactivePlaceholder.js'

/**
 * if functional placeholder's function name is not valid, make it not a placeholder
 * @param {string} text
 * @param {boolean} [noBrackets]
 * @returns {import('../../types.js').placeholder}
 */
const processPlaceholder = (text, noBrackets = false) => {
  // if the text has bracket, remove it
  const bracketsRemoved = noBrackets ? text : unBracket(text)
  // remove all spaces
  const content = bracketsRemoved.replace(/ /g, '')

  if (content.includes('(')) {
    return processFnPlaceholder(content)
  }
  return processReactivePlaceholder(content)
}

export default processPlaceholder
