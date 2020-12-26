// process tagged template literal
// does nothing extra, just concatenates the strings with expressions just like how it would be done
// this is just for better DX ( clean syntax and code highlighting)

import { bracketify } from './bracket.js'

// uses this
function html (strings, ...exprs) {
  let str = ''
  for (let i = 0; i < strings.length; i++) {
    const value = exprs[i]
    if (value) {
      if (typeof value === 'function') {
        const name = 'sweet' + i
        this.$[name] = value
        str += strings[i] + bracketify(name)
      } else str += strings[i] + value
    }
    else str += strings[i]
  }

  this.memo.template.innerHTML += str
}

export default html
