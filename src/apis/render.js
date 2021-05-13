import { createComponent } from '../utils/component/createComponent'
import { data } from '../utils/data'
import { attachErrorOverlay } from '../utils/dev/error-overlay/attachErrorOverlay'
import { errors } from '../utils/dev/errors'
import { dashify } from '../utils/string/dashify'

/**
 * render component in place of targetElement with optional config
 * @param {NueComp} compClass
 * @param {Config} [config]
 * @returns {Comp}
 */

export const render = (compClass, config) => {

  if (_DEV_) attachErrorOverlay()

  // override config with default config
  if (config) data._config = { ...data._config, ...config }

  createComponent(compClass)

  // replace the <component> with <component->
  const compFnName = compClass.name
  const targetElement = /** @type {Element}*/(document.querySelector(compFnName))

  if (_DEV_ && !targetElement) {
    throw errors.root_not_found_in_html(compFnName)
  }

  const customElement = /** @type {Comp}*/(document.createElement(dashify(compFnName)))
  targetElement.replaceWith(customElement)

  return customElement
}
