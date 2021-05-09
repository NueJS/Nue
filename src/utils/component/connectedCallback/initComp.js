import { flushArray } from '../../others'
import { parse } from '../../parse/parseNode'
import { nodeName } from '../../string/dashify'
import { defineCustomElement } from '../defineCustomElement'

/**
 * initialize the components template, parse the template and define the child components
 * @param {CompFn[]} childCompFns
 * @param {string} htmlString
 * @param {string} defaultStyle
 * @param {string} cssString
 * @param {Comp} comp
 * @param {CompData} compData
 */

export const initComp = (childCompFns, htmlString, defaultStyle, cssString, comp, compData) => {
  const childrenCompNames = getChildrenCompNames(childCompFns)

  const { _template } = compData

  // fill template
  _template.innerHTML = htmlString + style(defaultStyle, 'default') + style(cssString, 'scoped')

  /** @type {Function[]} */
  const deferredParsingWork = []

  // parse template
  parse(
    _template.content,
    childrenCompNames,
    deferredParsingWork,
    comp
  )

  compData._parsed = true

  flushArray(deferredParsingWork)

  // define childCompFns
  childCompFns.forEach(defineCustomElement)

}

/**
 * returns the map object which contains the name of child components
 * where the key is the nodeName of the child component and
 * value is the compFn name of the child component
 *
 * @param {CompFn[]} childCompFns
 */
const getChildrenCompNames = (childCompFns) => childCompFns.reduce(
  /**
   * @param {Record<string, string>} acc
   * @param {CompFn} childCompFn
   * @returns {Record<string, string>}
   */
  (acc, childCompFn) => {
    const { name } = childCompFn
    acc[nodeName(name)] = name
    return acc
  },
  {}
)

/**
   * return a inline style
   * @param {string} s
   * @param {string} name
   */
const style = (s, name) => `<style ${name}>${s}</style>`
