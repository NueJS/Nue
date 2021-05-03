import { defineCustomElement } from '../utils/component/defineCustomElement'
import { data } from '../utils/data'
import { attachErrorOverlay } from '../utils/dev/error-overlay/attachErrorOverlay'
import { dashify } from '../utils/string/dashify'

/**
 * render component in place of targetElement with optional config
 * @param {Function} component
 * @param {HTMLElement} targetElement
 * @param {Config} [config]
 * @returns {Comp}
 */

export const render = (component, targetElement, config) => {

  if (_DEV_) attachErrorOverlay()

  // override config with default config
  if (config) data._config = { ...data._config, ...config }

  defineCustomElement(component)

  // replace the targetElement with customElement
  const customElement = /** @type {Comp}*/(document.createElement(dashify(component.name)))
  targetElement.replaceWith(customElement)

  return customElement
}
