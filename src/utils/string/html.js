// process tagged template literal
// does nothing extra, just concatenates the strings with expressions just like how it would be done
// this is just for better DX ( clean syntax and code highlighting)

import { bracketify } from './placeholder'

function html (strings, ...exprs) {
  let str = ''
  let value
  for (let i = 0; i < strings.length; i++) {
    value = exprs[i]
    if (typeof value === 'function') {
      const name = 'sweet' + i
      this.$[name] = bracketify(name)
    }
    str += strings[i] + (value === undefined ? '' : value)
  }

  this.memo.template.innerHTML += str
}

export default html
