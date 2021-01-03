
import { bracketify } from './bracket.js'

// uses this
function html (strings, ...exprs) {
  let str = ''
  for (let i = 0; i < strings.length; i++) {
    const value = exprs[i]
    str += strings[i]
    if (value) {
      if (typeof value === 'object') {
        for (const k in value) str += `${k}='${value[k]}' `
      } else str += value
    }
    // else str += strings[i]
  }

  this.memo.template.innerHTML += str
}

export default html
