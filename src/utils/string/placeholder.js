// remove first and last character of the string

import { REACTIVE, FN, TEXT } from '../constants.js'
import slice from '../slice/slice.js'

// '[lorem ipsum]' -> 'lorem ipsum'
export const unwrap = str => str.substr(1, str.length - 2)

// return true if the string is wrapped in brackets
// '[xyz]' -> true
export const is_in_brackets = str => str[0] === '[' && str[str.length - 1] === ']'

export function process_placeholder (str, unwrapped = false) {
  let unwrapped_str = str
  if (!unwrapped) unwrapped_str = unwrap(str)
  const remove_spaces = unwrapped_str.replace(/ /g, '')
  const content = remove_spaces
  const is_fn_placeholder = content.includes('(') && content.includes(')')

  // if function is used inside the placeholder
  if (is_fn_placeholder) {
    const [fn_name, args_str] = content.split('(')
    console.log({ dis: this })
    const fn = this.fn[fn_name]
    if (fn) {
      const remove_closing_paren = args_str.substr(0, args_str.length - 1)
      const deps = remove_closing_paren.split(',')
      const args = deps.map(a => a.split('.'))

      // when args change call the callback function with the new value
      const on_args_change = (cb) => () => {
        const arg_values = args.map(a => slice(this.$, a))
        const value = fn(...arg_values)
        cb(value)
      }

      return { type: FN, deps, on_args_change }
    }

    else return { type: TEXT, string: content }
  }

  // if slice is used
  else return { type: REACTIVE, path: content.split('.'), content }
}
