import { hydrateProp } from './attributes/hydrateProp.js'
import { hydrateNormalAttribute } from './attributes/hydrateNormalAttribute.js'
import { hydrateEvent } from './attributes/hydrateEvent.js'
import { hydrateRef } from './attributes/hydrateRef.js'
import { hydrateState } from './attributes/hydrateState.js'
import { hydrateStaticState } from './attributes/hydrateStaticState.js'
import { hydrateFnProp } from './attributes/hydrateFnProp.js'
import { attributeTypes } from '../../enums'
import { hydrateConditionalAttribute } from './attributes/hydrateConditionalAttribute.js'

const {
  _event,
  _prop,
  _normal,
  _conditional,
  _functional,
  _state,
  _staticState,
  _ref,
  _bindProp
} = attributeTypes

const typeToFn = {
  [_event]: hydrateEvent,
  [_prop]: hydrateProp,
  [_bindProp]: hydrateProp,
  [_normal]: hydrateNormalAttribute,
  [_conditional]: hydrateConditionalAttribute,
  [_functional]: hydrateFnProp,
  [_state]: hydrateState,
  [_staticState]: hydrateStaticState,
  [_ref]: hydrateRef
}

/**
 * hydrate all attributes of given target in context of comp
 * @param {Parsed_HTMLElement | Comp} target
 * @param {Attribute_ParseInfo[]} attributes
 * @param {Comp} comp
 */
export const hydrateAttributes = (target, attributes, comp) => {
  attributes.forEach(attribute => {
    const type = attribute._type
    const fn = typeToFn[type]
    if (fn) {
      fn(
        // @ts-expect-error
        target,
        attribute,
        comp
      )
    }
  })
}
