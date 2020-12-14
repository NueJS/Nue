
import { TEXT } from '../constants.js'
import { process_placeholder } from './placeholder.js'

// split the text into placeholders and strings
// if the text inside the placeholder is not a valid path of slice of state, treat it as string
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
      // mark the bracket content as string
      if (text[i - 1] === '!') {
        str = str.substr(0, str.length - 1) + '['
        continue
      }

      in_placeholder = true
      // if str is not empty, add string
      if (str) {
        parts.push({ text: str, type: TEXT })
        str = ''
      }
    }

    // if end of placeholder, check for path validity
    else if (in_placeholder && text[i] === ']') {
      // remove [ then split to get the placeholder content
      // then split to get the path array
      parts.push(process_placeholder.call(this, str, true))

      // check for function call
      in_placeholder = false
      str = '' // reset
    }

    // collect str if not edge cases
    else {
      str += text[i]
    }
  }

  // remaining text is text
  if (str) parts.push({ text: str, type: TEXT })
  return parts
}

export default split
