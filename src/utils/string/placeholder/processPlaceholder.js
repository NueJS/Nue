import { unBracket } from '../bracket.js'
import processFnPlaceholder from './processFnPlaceholder.js'
import processReactivePlaceholder from './processReactivePlaceholder.js'

// if functional placeholder's function name is not valid, make it not a placeholder
function processPlaceholder (str, noBrackets = false) {
  let unbracketedStr = str
  // if the str has bracket, remove it
  if (!noBrackets) unbracketedStr = unBracket(str)
  // remove all spaces
  const content = unbracketedStr.replace(/ /g, '')
  // check for parens in content
  const isFnPlaceholder = content.includes('(') && content.includes(')')

  return isFnPlaceholder ? processFnPlaceholder(this, content, str, noBrackets) : processReactivePlaceholder(content, str, noBrackets)
}

export default processPlaceholder
