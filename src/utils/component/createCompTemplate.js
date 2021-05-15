import { data } from '../data'
import { flushArray } from '../others'
import { parse } from '../parse/parseNode'
import { dashifyComponentNames } from '../string/dashify'

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
  _template.innerHTML = dashHtml + style(data._config.defaultStyle, 'default') + style(css || '', 'scoped')

  /** @type {Function[]} */
  const deferredParsingWork = []

  parse(_template.content, compDef, deferredParsingWork)

  flushArray(deferredParsingWork)

}

/**
   * return a inline style
   * @param {string} s
   * @param {string} name
   */
const style = (s, name) => `<style ${name}>${s}</style>`
