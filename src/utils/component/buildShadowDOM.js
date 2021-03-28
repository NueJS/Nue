import { getParsedClone } from '../node/clone.js'
import { flushArray } from '../others.js'
import { hydrate } from '../hydration/hydrate.js'

/**
 * hydrate templateElement and add it in shadowDOM of comp
 * @param {Comp} comp
 * @param {HTMLTemplateElement} templateElement
 */
export const buildShadowDOM = (comp, templateElement) => {

  // @ts-expect-error
  const fragment = getParsedClone(templateElement.content)

  hydrate(fragment, comp)

  flushArray(comp._deferredWork)

  comp.attachShadow({ mode: 'open' }).append(fragment)

}
