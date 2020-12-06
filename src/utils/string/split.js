// split the text into placeholders and strings
// if the text inside the placeholder is not a valid path of slice of state, treat it as string

import { add_fn_deps } from './fn.js'

// returns parts array of object
// input: 'name is [name.first]'
// output: [ { string : 'name is' }, { path: ['name', 'first'], value: 'Manan' }]

function split (text) {
  const parts = []
  let in_placeholder = false
  let str = ''

  for (let i = 0; i < text.length; i++) {
    // if not the end of placeholder
    if (in_placeholder && text[i] !== ']') str += text[i]

    // if found the start of new placeholder
    else if (text[i] === '[') {
      in_placeholder = true
      // if str is not empty, add string
      if (str) {
        parts.push({ string: str })
        str = '['
      }
    }

    // if end of placeholder, check for path validity
    else if (in_placeholder && text[i] === ']') {
      // remove [ then split to get the placeholder content
      // then split to get the path array
      const content = str.substr(1)
      const has_parens = content.includes('(') && content.includes('(')
      if (has_parens) {
        parts.push(add_fn_deps.call(this, content))
      } else {
        const path = content.split('.')
        parts.push({ path, string: str + ']', content })
      }

      // check for function call
      in_placeholder = false
      str = '' // reset
    }

    // collect str if not edge cases
    else {
      str += text[i]
    }
  }

  // remaining text is string
  if (str) parts.push({ string: str })
  return parts
}

export default split
