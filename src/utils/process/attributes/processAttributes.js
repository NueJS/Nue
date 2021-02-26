import bindInput from './bindInput.js'
import addAttribute from './addAttribute.js'
import addEvent from './addEvent.js'
import { EVENT, BIND, NORMAL, CONDITIONAL } from '../../constants.js'
import { attr } from '../../node/dom.js'

const typeToFn = {
  [EVENT]: addEvent,
  [BIND]: bindInput,
  [NORMAL]: addAttribute,
  [CONDITIONAL]: addAttribute
}

const processAttributes = (nue, node, parsed) => {
  const ref = attr(node, 'ref')
  if (ref) nue.refs[ref] = node

  parsed.attributes.forEach(attribute => {
    const { type } = attribute
    const fn = typeToFn[type]
    if (fn) fn(nue, node, attribute)
  })
}

export default processAttributes
