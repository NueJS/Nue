import { getParsedClone } from '../node/clone.js'
import { flushArray } from '../others.js'
import { hydrate } from '../hydration/hydrate.js'

/**
 * hydrate template and add it in shadowDOM of comp
 * @param {Comp} comp
 * @param {HTMLTemplateElement} template
 */
export const buildShadowDOM = (comp, template) => {

  // @ts-expect-error
  const fragment = getParsedClone(template.content)

  hydrate(fragment, comp)

  flushArray(comp._deferredWork)

  comp.attachShadow({ mode: 'open' }).append(fragment)

}
