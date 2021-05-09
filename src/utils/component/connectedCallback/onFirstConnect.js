import { hydrate } from '../../hydration/hydrate'
import { hydrateAttributes } from '../../hydration/hydrateAttributes'
import { reactify } from '../../reactivity/reactify'
import { subscribeNode } from '../../subscription/node'
import { buildShadowDOM } from '../buildShadowDOM'
import { runComponent } from '../runComponent'
import { initComp } from './initComp'

/**
 * this function is called when comp is connected to DOM for the first time
 * @param {Comp} comp
 * @param {CompFn} compFn
 * @param {CompData} compData
 * @param {string} defaultStyle
 */

export function onFirstConnect (comp, compFn, compData, defaultStyle) {
  // create $
  comp.$ = reactify(comp, comp._prop$ || {}, [])

  // if the component is looped, hydrate attributes
  if (comp._isLooped) {
    hydrateAttributes(comp, comp._parsedInfo._attributes, comp)
  }

  // run the component and get the html, css and childCompFns data
  const [htmlString, cssString, childCompFns] = runComponent(comp, compFn, compData._parsed)

  // do this only once per component - not for all instances
  if (!compData._parsed) {
    initComp(childCompFns, htmlString, defaultStyle, cssString, comp, compData)
  }

  // hydrate DOM and shadow DOM
  // TODO: process should be able to take the fragment node
  comp.childNodes.forEach(node => hydrate(node, comp))

  buildShadowDOM(comp, /** @type {HTMLTemplateElement}*/(compData._template))

  // subscribe node, so that it's attributes are in sync
  subscribeNode(comp)

}
