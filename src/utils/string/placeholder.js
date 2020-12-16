import { REACTIVE, FN, TEXT } from '../constants.js'
import slice from '../state/slice.js'

export const unBracket = str => str.substr(1, str.length - 2)

export const bracketify = str => `[${str}]`

export const isBracketed = str => str[0] === '[' && str[str.length - 1] === ']'

// process the reactive or functional place holder
// if functional placeholder's function name is not valid, make it not a placeholder
export function process_placeholder (str, unwrapped = false) {
  let unwrapped_str = str
  if (!unwrapped) unwrapped_str = unBracket(str)
  const remove_spaces = unwrapped_str.replace(/ /g, '')
  const content = remove_spaces
  const is_fn_placeholder = content.includes('(') && content.includes(')')

  // if function is used inside the placeholder
  if (is_fn_placeholder) {
    const [fnName, args_str] = content.split('(')

    if (this.fn[fnName]) {
      const remove_closing_paren = args_str.substr(0, args_str.length - 1)
      const slices = remove_closing_paren.split(',')
      const deps = slices.map(a => a.split('.'))

      function getValue (node) {
        const values = deps.map(path => slice(this, path))
        return this.fn[fnName](...values)
      }

      return { type: FN, deps, getValue, content }
    }

    else return { type: TEXT, text: content }
  }

  // if slice is used
  else {
    const path = content.split('.')
    function getValue (node) {
      return slice(this.$, path)
    }
    return { type: REACTIVE, path, content, getValue, deps: [path], text: str }
  }
}

// in not a valid placeholder, turn it into string
export function handleInvalidPlaceholder (node, placeholder) {
  const { text, getValue } = placeholder
  let value
  try { value = getValue.call(this, node) } catch { /**/ }
  if (value === undefined) {
    node.textContent = bracketify(text)
    return true // show that it is invalid
  }

  return false
}
