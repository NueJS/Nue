import { placeholderTypes } from '../../../enums.js'
import { errors } from '../../dev/errors/index.js'
import { mutate } from '../../state/mutate.js'
import { syncNode } from '../../subscription/node.js'

/**
 * add prop on target
 * @param {Parsed_HTMLElement} target
 * @param {Attribute_ParseInfo} attribute
 * @param {Comp} comp
 */
export const hydrateProp = (target, attribute, comp) => {
  // [{ getValue, deps, type, content }, propName]
  const propName = attribute._name
  const { _getValue, _type, _content, _statePaths, _text } = /** @type {Placeholder} */(attribute._placeholder)
  const setProp = () => {
    // @ts-expect-error
    target[propName] = _getValue(comp)
  }

  if (target.matches('input, textarea')) {
    // TODO: move this error to parsing phase
    if (_DEV_ && _type === placeholderTypes._functional) throw errors.function_placeholder_used_in_input_binding(comp, _content, _text)

    // @ts-expect-error
    const isNumber = target.type === 'number' || target.type === 'range'

    const handler = () => {
      // @ts-expect-error
      let value = target[propName]
      value = isNumber ? Number(value) : value
      mutate(comp.$, _statePaths[0], value)
    }

    target.addEventListener('input', handler)
  }

  syncNode(comp, target, _statePaths, setProp)
}
