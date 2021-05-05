import { defineCustomElement } from '../utils/component/defineCustomElement'
import { data } from '../utils/data'
import { attachErrorOverlay } from '../utils/dev/error-overlay/attachErrorOverlay'
import { errors } from '../utils/dev/errors'
import { dashify } from '../utils/string/dashify'

/**
 * render component in place of targetElement with optional config
 * @param {Function} component
 * @param {Config} [config]
 * @returns {Comp}
 */

export const render = (component, config) => {

  if (_DEV_) attachErrorOverlay()

  // override config with default config
  if (config) data._config = { ...data._config, ...config }

  defineCustomElement(component)

  // replace the <component> with <component->
  const targetElement = /** @type {Element}*/(document.querySelector(component.name))

  if (_DEV_ && !targetElement) {
    throw errors.root_not_found_in_html(component.name)
  }
  const customElement = /** @type {Comp}*/(document.createElement(dashify(component.name)))
  targetElement.replaceWith(customElement)

  return customElement
}
