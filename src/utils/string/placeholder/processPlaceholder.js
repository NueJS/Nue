import { unBracket } from '../bracket.js'
import processReactivePlaceholder from './processReactivePlaceholder.js'

// if functional placeholder's function name is not valid, make it not a placeholder
function processPlaceholder (text, noBrackets = false) {
  // if the text has bracket, remove it
  const bracketsRemoved = noBrackets ? text : unBracket(text)
  // remove all spaces
  const content = bracketsRemoved.replace(/ /g, '')

  return processReactivePlaceholder(content)
}

export default processPlaceholder
