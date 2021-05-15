import { attributeTypes } from '../../enums'
import { mutate } from '../../state/mutate'
import { syncNode } from '../../subscription/node'

/**
 * add prop on target
 * @param {Parsed_HTMLElement} target
 * @param {Attribute_ParseInfo} attribute
 * @param {Comp} comp
 */
export const hydrateProp = (target, attribute, comp) => {

  const propName = attribute._name

  const { _getValue, _statePaths } = /** @type {Placeholder} */(attribute._placeholder)

  const setProp = () => {
    // @ts-expect-error
    target[propName] = _getValue(comp)
  }

  syncNode(comp, target, _statePaths, setProp)

  // bind:prop
  if (attribute._type === attributeTypes._bindProp) {
    // @ts-expect-error
    const isNumber = target.type === 'number' || target.type === 'range'

    const handler = () => {
      // @ts-expect-error
      let value = target[propName]

      value = isNumber ? Number(value) : value

      // as this is not a functional placeholder - it will only have one state dependency - so use the first one
      mutate(comp.$, _statePaths[0], value)
    }

    target.addEventListener('input', handler)
  }
}
