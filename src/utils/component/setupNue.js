import { FUNCTION_ATTRIBUTE, NORMAL, PARSED, STATE, STATIC_STATE } from '../constants.js'
import addStateFromAttribute from './addStateFromAttribute.js'
import reactify from '../reactivity/reactify.js'

const setupNue = (compNode) => {
  const { closure, loopClosure } = compNode
  if (closure) {
    const { attributes } = compNode[PARSED]
    compNode.fn = Object.create(closure.fn)

    if (attributes) {
      attributes.forEach(attribute => {
        const [value, name, type] = attribute
        if (type === STATE) addStateFromAttribute(closure, compNode, attribute)
        else if (type === STATIC_STATE) compNode.init$[name] = value
        else if (type === NORMAL && loopClosure) compNode.setAttribute(name, value.getValue(closure.$, loopClosure))
        else if (type === FUNCTION_ATTRIBUTE) compNode.fn[name] = compNode.closure.fn[value]
      })
    }
  } else {
    compNode.fn = {}
  }

  // debugger

  // create reactive state
  const closure$ = closure && closure.$
  compNode.$ = reactify(compNode, compNode.init$, [], closure$)
}

export default setupNue
