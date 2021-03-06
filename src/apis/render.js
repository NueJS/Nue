import { createComponent } from '../component/createComponent'
import { data } from '../info'
import { attachErrorOverlay } from '../dev/error-overlay/attachErrorOverlay'
import { errors } from '../dev/errors/index.js'
import { createElement } from '../dom/create'
import { dashify } from '../string/dashify'
import { devInfo } from '../dev/devInfo'

/**
 * render component in place of targetElement with optional config
 * @param {NueComp} compClass
 * @param {Config} [config]
 * @returns {Comp}
 */

export const render = (compClass, config) => {

  // override config with default config
  if (config) {
    data._config = { ...data._config, ...config }

    // add devTools
    if (_DEV_) {
      const { nodeUpdated } = config
      if (nodeUpdated) devInfo.nodeUpdated = nodeUpdated
    }
  }

  if (_DEV_) {
    attachErrorOverlay()
  }

  createComponent(compClass)

  // replace the <component> with <component->
  const compName = compClass.name
  const targetElement = /** @type {Element}*/(document.querySelector(compName))

  if (_DEV_ && !targetElement) {
    throw errors.root_not_found_in_html(compName)
  }

  const customElement = /** @type {Comp}*/(createElement(dashify(compName)))
  targetElement.replaceWith(customElement)

  return customElement
}
