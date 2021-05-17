import { data } from '../info'
import { parse } from '../parse/parseNode'
import { dashifyComponentNames } from '../string/dashify'
import { flushArray } from '../utils/array'

/**
 * create template and parse it
 * @param {CompDef} compDef
 */

export const createCompTemplate = (compDef) => {

  const { components, html, css, _template } = compDef

  // replace compName with elName in html
  const dashHtml = components
    ? dashifyComponentNames(html, components)
    : html

  // fill template innerHTML with html and css
  _template.innerHTML =
    dashHtml +
    style(data._config.defaultCSS, 'default') +
    style(css, 'scoped')

  /** @type {Function[]} */
  const deferredParsingWork = []

  parse(_template.content, compDef, deferredParsingWork)

  flushArray(deferredParsingWork)

}

/**
 * returns inline style
 * @param {string|undefined} css
 * @param {string} name
 */
const style = (css, name) => css ? `<style ${name}>${css}</style>` : ''
