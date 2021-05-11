import { hydrate } from '../../hydration/hydrate'
import { hydrateAttributes } from '../../hydration/hydrateAttributes'
import { reactify } from '../../reactivity/reactify'
import { subscribeNode } from '../../subscription/node'
import { buildShadowDOM } from '../buildShadowDOM'
import { defineCustomElement } from '../defineCustomElement'
import { invokeCompJs } from '../invokeCompJs'
import { initComp } from './initComp'

/**
 * this function is called when comp is connected to DOM for the first time
 * @param {Comp} comp
 * @param {NueComp} CompClass
 * @param {CompData} compData
 * @param {string} defaultStyle
 */

export function onFirstConnect (comp, CompClass, compData, defaultStyle) {

  comp.$ = reactify(comp, comp._prop$ || {}, [])

  // if the component is looped, hydrate attributes
  if (comp._isLooped) {
    hydrateAttributes(comp, comp._parsedInfo._attributes, comp)
  }

  const compInstance = new CompClass()
  if (compInstance.js) invokeCompJs(compInstance.js, comp)

  // do this only once per component - not for all instances
  if (!compData._parsed) {
    initComp(compInstance, comp, compData, defaultStyle)
    if (compInstance.uses) compInstance.uses.forEach(defineCustomElement)
  }

  // hydrate DOM
  comp.childNodes.forEach(node => hydrate(node, comp))
  // create shadowDOM
  buildShadowDOM(comp, /** @type {HTMLTemplateElement}*/(compData._template))

  // subscribe node, so that it's attributes are in sync
  subscribeNode(comp)

}
