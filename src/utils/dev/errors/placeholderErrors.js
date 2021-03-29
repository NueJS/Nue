import { createError } from '../createError'
import { getCode } from '../getCode'
import { compName } from '../name'

/**
 * @param {Comp} comp
 * @param {string} content
 * @returns {Error}
 */
export const invalid_state_placeholder = (comp, content) => {
  const issue = `Could not find value of [${content}] in ${compName(comp)}`
  const fix = `Make sure [${content}] is available in state or it's closure`
  const code = getCode(comp, content)
  const type = 'invalid_state_placeholder'
  return createError(type, issue, fix, comp, code)
}

/**
 * @param {Comp} comp
 * @param {string} fnName
 * @returns {Error}
 */
export const function_not_found = (comp, fnName) => {
  const issue = `invalid function "${fnName}" used in ${compName(comp)}`
  const fix = `Make sure that "${fnName}" is defined in the fn or it's parent fn`
  let code = getCode(comp, `'${fnName}'`)
  if (!code) {
    code = getCode(comp, `"${fnName}"`)
  }

  const type = 'function_not_found'
  return createError(type, issue, fix, comp, code)
}

/**
 *
 * @param {Comp} comp
 * @param {string} collectedString
 * @returns {Error}
 */
export const placeholder_not_closed = (comp, collectedString) => {
  const text = `"[${collectedString}"`
  const trimmed = `"${collectedString.trim()}"`
  const ifNotPlaceholder = `if ${trimmed} is not a state placeholder: \nprefix the bracket with "!" -> "![${collectedString}" `
  const ifPlaceholder = `if ${trimmed} is a placeholder: \nInsert closing -> "[${collectedString}]"`

  const issue = `\
found unclosed placeholder in ${compName(comp)} -> "[${collectedString}"`

  const fix = `${ifNotPlaceholder}\n\n${ifPlaceholder}`
  const code = getCode(comp, `[${collectedString}`)

  const type = 'placeholder_not_closed'

  return createError(type, issue, fix, comp, code)
}
