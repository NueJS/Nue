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
  const { defaultCSS } = data._config

  const defaultStyleTag = defaultCSS ? style(defaultCSS, 'default') : ''
  const scopedStyleTag = css ? style(css, 'scoped') : ''

  _template.innerHTML = dashHtml + defaultStyleTag + scopedStyleTag

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
