import { attributeTypes } from '../../../enums.js'
import errors from '../../dev/errors.js'
import mutate from '../../state/mutate.js'
import { syncNode } from '../../subscription/node.js'

/**
 * add prop on target
 * @param {import('types/dom').Parsed_HTMLElement} target
 * @param {import('types/parsed').Attribute_ParseInfo} attribute
 * @param {import('types/dom').Comp} comp
 */
const addProp = (target, attribute, comp) => {
  // [{ getValue, deps, type, content }, propName]
  const propName = attribute._name
  const { _getValue, _type, _content, _stateDeps } = /** @type {import('types/placeholder').Placeholder} */(attribute._placeholder)
  const setProp = () => {
    // @ts-expect-error
    target[propName] = _getValue(comp)
  }

  if (target.matches('input, textarea')) {
    // TODO: move this error to parsing phase
    if (_DEV_ && _type === attributeTypes._functional) {
      throw errors.INVALID_INPUT_BINDING(comp._compFnName, _content)
    }

    // @ts-expect-error
    const isNumber = target.type === 'number' || target.type === 'range'

    const handler = () => {
      // @ts-expect-error
      let value = target[propName]
      value = isNumber ? Number(value) : value
      mutate(comp.$, _stateDeps[0], value)
    }

    target.addEventListener('input', handler)
  }

  syncNode(comp, target, _stateDeps, setProp)
}

export default addProp
