import { createError } from '../utils/createError'
import { getCodeWithError } from '../utils/code'

/**
 * called when state placeholder is either a invalid path or a path which points to an undefined value in state
 * @param {Comp} comp
 * @param {string} content
 * @returns {Error}
 */
export const invalid_state_placeholder = (comp, content) => {
  const compNodeName = `<${comp._compName}>`
  const issue = `invalid state placeholder: [${content}] used in ${compNodeName}`
  const fix = `Make sure that "${content}" is available in state of ${compNodeName} or it's closure`
  const regex = content.split('').join('\\s*')
  const errorCode = getCodeWithError(comp._compName, new RegExp(`\\[\\w*${regex}\\w*\\]`))
  return createError(issue, fix, comp, errorCode, invalid_state_placeholder.name)
}

/**
 * called when function used in template is not defined
 * @param {Comp} comp
 * @param {string} fnName
 * @returns {Error}
 */
export const function_not_found = (comp, fnName) => {
  const compNodeName = `<${comp._compName}>`
  const issue = `invalid function "${fnName}" used in ${compNodeName}`
  const fix = `Make sure that "${fnName}" is defined in the fn or it's parent fn`
  const errorCode = getCodeWithError(comp._compName, new RegExp(`=.*${fnName}`))
  return createError(issue, fix, comp, errorCode, function_not_found.name)
}

/**
 * called when a placeholder is opened but not closed
 * @param {string} compName
 * @param {string} collectedString
 * @returns {Error}
 */
export const placeholder_not_closed = (compName, collectedString) => {

  const trimmed = `"${collectedString.trim()}"`
  const ifNotPlaceholder = `if ${trimmed} is not a state placeholder: \nprefix the bracket with "!" -> "![${collectedString}" `
  const ifPlaceholder = `if ${trimmed} is a placeholder: \nInsert closing -> "[${collectedString}]"`
  const nodeName = `<${compName}>`

  const issue = `\
found unclosed placeholder in ${nodeName} -> "[${collectedString}"`

  const fix = `${ifNotPlaceholder}\n\n${ifPlaceholder}`
  const errorCode = getCodeWithError(compName, new RegExp(`[${collectedString}`))

  return createError(issue, fix, null, errorCode, placeholder_not_closed.name)
}
