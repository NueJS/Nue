import slice from '../slice/slice.js'

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
      const path = str.substr(1).split('.')

      // get the value from path, to check if the placeholder is valid or not
      let value

      // path is invalid if slice() throws
      // if path is invalid don't treat the string as placeholder
      try { value = slice(this.$, path) } catch { /**/ }

      // if slice does not throw and value is undefined, path is still not valid

      // if the path is not valid, treat it as string
      if (value === undefined) {
        in_placeholder = false
        str += text[i]
      }

      // if the path is valid, treat it as a placeholder
      else {
        parts.push({ path, value })
        in_placeholder = false
        str = '' // reset
      }
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
