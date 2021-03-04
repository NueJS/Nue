import bindInput from './bindInput.js'
import addAttribute from './addAttribute.js'
import addEvent from './addEvent.js'
import { EVENT, BIND, NORMAL, CONDITIONAL, REF, STATE, STATIC_STATE, FUNCTION_ATTRIBUTE } from '../../constants.js'
import addRef from './addRef.js'
import addState from './addState.js'
import addStaticState from './addStaticState.js'
import addFn from './addFn.js'

const typeToFn = {
  [EVENT]: addEvent,
  [BIND]: bindInput,
  [NORMAL]: addAttribute,
  [CONDITIONAL]: addAttribute,
  [FUNCTION_ATTRIBUTE]: addFn,
  [STATE]: addState,
  [STATIC_STATE]: addStaticState,
  [REF]: addRef
}

const processAttributes = (compNode, node, attributes) => {
  attributes.forEach(attribute => {
    const type = attribute[2]
    const fn = typeToFn[type]
    if (fn) fn(compNode, node, attribute)
  })
}

export default processAttributes
