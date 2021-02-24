import { FUNCTION_ATTRIBUTE, STATE, STATIC_STATE } from '../constants.js'
import addStateFromAttribute from './addStateFromAttribute.js'
import reactify from '../reactivity/reactify.js'

const setupNue = (node) => {
  const { nue } = node
  const { parsed } = node
  if (parsed) {
    const { closure, loopClosure, attributes } = parsed

    // if the closure is available, inherit fn
    if (closure) {
      nue.closure = closure // @todo move this to node maybe so we don't have to save it in parsed and nue ?
      nue.fn = Object.create(closure.fn)

      if (attributes) {
        attributes.forEach(at => {
          if (at.type === STATE) addStateFromAttribute(closure, nue, at)
          else if (at.type === STATIC_STATE) nue.initState[at.name] = at.placeholder
          else if (at.type === FUNCTION_ATTRIBUTE) nue.fn[at.name] = nue.closure.fn[at.placeholder]
        })
      }
    }

    // @todo save it in node maybe so don't have to save it in two places ?
    if (loopClosure) {
      nue.loopClosure = loopClosure
    }
  }

  // create reactive state
  const closure$ = nue.closure && nue.closure.$
  nue.$ = reactify(nue, nue.initState, [], closure$)
}

export default setupNue
