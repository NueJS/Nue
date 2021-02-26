import { FUNCTION_ATTRIBUTE, STATE, STATIC_STATE } from '../constants.js'
import addStateFromAttribute from './addStateFromAttribute.js'
import reactify from '../reactivity/reactify.js'

const setupNue = (node) => {
  const { nue } = node
  const { parsed } = node
  if (parsed) {
    const { closure, loopClosure, attributes } = parsed

    // @todo save it in node maybe so don't have to save it in two places ?
    if (loopClosure) {
      nue.loopClosure = loopClosure
    }

    // if the closure is available, inherit fn
    if (closure) {
      nue.closure = closure // @todo move this to node maybe so we don't have to save it in parsed and nue ?
      nue.fn = Object.create(closure.fn)

      if (attributes) {
        attributes.forEach(attribute => {
          const [value, name, type] = attribute
          if (type === STATE) addStateFromAttribute(closure, nue, attribute)
          else if (type === STATIC_STATE) nue.initState[name] = value
          else if (type === FUNCTION_ATTRIBUTE) nue.fn[name] = nue.closure.fn[value]
        })
      }
    }
  }

  // create reactive state
  const closure$ = nue.closure && nue.closure.$
  nue.$ = reactify(nue, nue.initState, [], closure$)
}

export default setupNue
