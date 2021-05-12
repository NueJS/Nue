import { data } from '../../data'
import { flushArray } from '../../others'
import { parse } from '../../parse/parseNode'
import { dashifyComponentNames } from '../../string/dashify'

/**
 * initialize the components template, parse the template and define the child components
 * @param {CompDef} compDef
 */

export const initComp = (compDef) => {

  const { uses, html, css, _template } = compDef

  const dashHtml = uses
    ? dashifyComponentNames(html, uses)
    : html

  // fill template
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
