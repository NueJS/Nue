import bindInput from './bindInput.js'
import addAttribute from './addAttribute.js'
import addEvent from './addEvent.js'
import { EVENT, BIND, NORMAL, CONDITIONAL, REF } from '../../constants.js'
import addRef from './addRef.js'

const typeToFn = {
  [EVENT]: addEvent,
  [BIND]: bindInput,
  [NORMAL]: addAttribute,
  [CONDITIONAL]: addAttribute,
  [REF]: addRef
}

const processAttributes = (nue, node, attributes) => {
  attributes.forEach(attribute => {
    const { type } = attribute
    const fn = typeToFn[type]
    if (fn) fn(nue, node, attribute)
  })
}

export default processAttributes
