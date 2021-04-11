import { createError } from '../utils/createError'
import { getCodeWithError } from '../utils/code'
import { angularCompName } from '../utils/angularName'

/**
 * called when state placeholder is either a invalid path or a path which points to an undefined value in state
 * @param {Comp} comp
 * @param {string} content
 * @returns {Error}
 */
export const invalid_state_placeholder = (comp, content) => {
  const issue = `invalid state placeholder: [${content}] used in ${angularCompName(comp)}`
  const fix = `Make sure that "${content}" is available in state of ${angularCompName(comp)} or it's closure`
  const regex = content.split('').join('\\s*')
  const errorCode = getCodeWithError(comp, new RegExp(`\\[\\w*${regex}\\w*\\]`))
  return createError(issue, fix, comp, errorCode, invalid_state_placeholder.name)
}

/**
 * called when function used in template is not defined
 * @param {Comp} comp
 * @param {string} fnName
 * @returns {Error}
 */
export const function_not_found = (comp, fnName) => {
  const issue = `invalid function "${fnName}" used in ${angularCompName(comp)}`
  const fix = `Make sure that "${fnName}" is defined in the fn or it's parent fn`
  const errorCode = getCodeWithError(comp, new RegExp(`=.*${fnName}`))
  return createError(issue, fix, comp, errorCode, function_not_found.name)
}

/**
 *  called when a placeholder is opened but not closed
 * @param {Comp} comp
 * @param {string} collectedString
 * @returns {Error}
 */
export const placeholder_not_closed = (comp, collectedString) => {

  const trimmed = `"${collectedString.trim()}"`
  const ifNotPlaceholder = `if ${trimmed} is not a state placeholder: \nprefix the bracket with "!" -> "![${collectedString}" `
  const ifPlaceholder = `if ${trimmed} is a placeholder: \nInsert closing -> "[${collectedString}]"`

  const issue = `\
found unclosed placeholder in ${angularCompName(comp)} -> "[${collectedString}"`

  const fix = `${ifNotPlaceholder}\n\n${ifPlaceholder}`
  const errorCode = getCodeWithError(comp, new RegExp(`[${collectedString}`))

  return createError(issue, fix, comp, errorCode, placeholder_not_closed.name)
}
