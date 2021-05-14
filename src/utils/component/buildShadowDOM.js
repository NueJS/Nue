import { getParsedClone } from '../node/clone.js'
import { flushArray } from '../others.js'
import { hydrate } from '../hydration/hydrate.js'

/**
 * hydrate template and add it in shadowDOM of comp
 * @param {Comp} comp
 * @param {HTMLTemplateElement} template
 */
export const buildShadowDOM = (comp, template) => {

  // create a clone of template
  // @ts-expect-error
  const fragment = getParsedClone(template.content)

  // hydrate it
  hydrate(fragment, comp)

  // complete the deferredWork
  flushArray(comp._deferredWork)

  // create shadowDOM using this template
  comp.attachShadow({ mode: 'open' }).append(fragment)

}
