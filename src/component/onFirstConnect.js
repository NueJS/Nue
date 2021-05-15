import { hydrate } from '../hydrate/hydrate'
import { hydrateAttributes } from '../hydrate/hydrateAttributes'
import { reactify } from '../reactivity/reactify'
import { subscribeNode } from '../subscription/node'
import { buildShadowDOM } from './buildShadowDOM'
import { invokeCompJs } from './invokeCompJs'

/**
 * this function is called when comp is connected to DOM for the first time
 * @param {Comp} comp
 * @param {CompDef} compDef
 */

export function onFirstConnect (comp, compDef) {

  // create state
  comp.$ = reactify(comp, comp._prop$ || {}, [])

  // after everything is set up, invoke js
  if (compDef.js) invokeCompJs(compDef.js, comp)

  // manually created looped component requires hydration
  if (comp._isLooped) {
    hydrateAttributes(comp, comp._parsedInfo._attributes, comp)
  }

  // hydrate DOM (for slots)
  comp.childNodes.forEach(node => hydrate(node, comp))

  // create shadowDOM
  buildShadowDOM(comp, compDef._template)

  // keep the attributes of comp element in sync
  subscribeNode(comp)

}
