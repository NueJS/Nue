// remove first and last character of the string

import { REACTIVE, FN, TEXT } from '../constants.js'
import slice from '../slice/slice.js'

// '[lorem ipsum]' -> 'lorem ipsum'
export const unwrap = str => str.substr(1, str.length - 2)

// return true if the string is wrapped in brackets
// '[xyz]' -> true
export const is_in_brackets = str => str[0] === '[' && str[str.length - 1] === ']'

// process the reactive or functional place holder
// if functional placeholder's function name is not valid, make it not a placeholder
export function process_placeholder (str, unwrapped = false) {
  let unwrapped_str = str
  if (!unwrapped) unwrapped_str = unwrap(str)
  const remove_spaces = unwrapped_str.replace(/ /g, '')
  const content = remove_spaces
  const is_fn_placeholder = content.includes('(') && content.includes(')')

  // if function is used inside the placeholder
  if (is_fn_placeholder) {
    const [fn_name, args_str] = content.split('(')
    const fn = this.fn[fn_name]
    if (fn) {
      const remove_closing_paren = args_str.substr(0, args_str.length - 1)
      const deps = remove_closing_paren.split(',')
      const args = deps.map(a => a.split('.'))

      const get_value = () => {
        const arg_values = args.map(a => slice(this.$, a))
        return fn(...arg_values)
      }

      return { type: FN, deps, get_value }
    } else {
      throw new Error(`invalid function ${fn_name} used in ${this.memo.compName}`)
    }

    // else return { type: TEXT, text: content }
  }

  // if slice is used
  else {
    const path = content.split('.')
    const get_value = () => slice(this.$, path)
    return { type: REACTIVE, path, content, get_value }
  }
}
