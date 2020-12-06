// remove first and last character of the string

import { placeholder_type } from '../constants'

// '[lorem ipsum]' -> 'lorem ipsum'
export const unwrap = str => str.substr(1, str.length - 2)

// return true if the string is wrapped in brackets
// '[xyz]' -> true
export const is_placeholder = str => str[0] === '[' && str[str.length - 1] === ']'

// '[ a.b.c.d ]' -> { type: 'path', path: ['a', 'b', 'c', 'd'] }
// '[ foo(bar, bazz.fizz) ]' -> { type: 'fn', paths: [ ['foo'], ['bazz', 'fizz'] ] }
export const process_placeholder = (str) => {
  const unwrapped_str = unwrap(str)
  const remove_spaces = unwrapped_str.replace(/ /g, '')
  const content = remove_spaces

  // if function is used inside the placeholder
  if (content.includes('(') && content.includes(')')) {
    const [fn_name, args_str] = content.split('(')
    const remove_closing_paren = args_str.substr(0, args_str.length - 1)
    const args = remove_closing_paren.split(',')
    return {
      type: placeholder_type.FN,
      value: {
        fn_name,
        args: args.map(a => a.split('.'))
      }
    }
  }

  // if slice is used
  else {
    return {
      type: placeholder_type.REACTIVE,
      value: content.split('.'),
      content
    }
  }
}
