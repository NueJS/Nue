import { unBracket } from '../bracket.js'
import processFnPlaceholder from './processFnPlaceholder.js'
import processReactivePlaceholder from './processReactivePlaceholder.js'

// if functional placeholder's function name is not valid, make it not a placeholder
function processPlaceholder (text, noBrackets = false) {
  // if the text has bracket, remove it
  const bracketsRemoved = noBrackets ? text : unBracket(text)

  // remove all spaces
  const content = bracketsRemoved.replace(/ /g, '')

  // check for parens in content
  const isFnPlaceholder = content.includes('(')

  return isFnPlaceholder
    ? processFnPlaceholder(content)
    : processReactivePlaceholder(content)
}

export default processPlaceholder
