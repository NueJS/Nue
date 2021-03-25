import { getParsedClone } from '../node/clone.js'
import { flushArray } from '../others.js'
import { hydrate } from '../hydration/hydrate.js'

/**
 * hydrate templateElement and add it in shadowDOM of comp
 * @param {import('types/dom').Comp} comp
 * @param {HTMLTemplateElement} templateElement
 */
export const buildShadowDOM = (comp, templateElement) => {
  const fragment = getParsedClone(templateElement.content)

  hydrate(comp, fragment)

  flushArray(comp._deferredWork)

  const shadowRoot = comp.attachShadow({ mode: 'open' })

  shadowRoot.append(fragment)
}
