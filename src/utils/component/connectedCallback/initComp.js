import { flushArray } from '../../others'
import { parse } from '../../parse/parseNode'
import { dashifyComponentNames, nodeName } from '../../string/dashify'

/**
 * initialize the components template, parse the template and define the child components
 * @param {CompFn} compFn
 * @param {Comp} comp
 * @param {CompData} compData
 * @param {string} defaultStyle
 */

export const initComp = (compInstance, comp, compData, defaultStyle) => {

  const { _template } = compData

  const childrenCompNames = compInstance.uses ? getChildrenCompNames(compInstance.uses) : {}

  const html = compInstance.uses ? dashifyComponentNames(compInstance.html, compInstance.uses) : compInstance.html

  // fill template
  _template.innerHTML =
  html +
  style(defaultStyle, 'default') +
  style(compInstance.css, 'scoped')

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
