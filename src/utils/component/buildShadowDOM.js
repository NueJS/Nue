import getClone from '../node/clone.js'
import { flushArray } from '../others.js'
import { hydrate } from '../hydration/hydrate.js'

/**
 * hydrate templateElement and add it in shadowDOM of comp
 * @param {import('types/dom').Comp} comp
 * @param {HTMLTemplateElement} templateElement
 */
const buildShadowDOM = (comp, templateElement) => {
  const fragment = getClone(templateElement.content)

  hydrate(comp, fragment)

  flushArray(comp.__deferredWork)

  const shadowRoot = comp.attachShadow({ mode: 'open' })

  shadowRoot.append(fragment)
}

export default buildShadowDOM
