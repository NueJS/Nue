import { createElement } from '../node/dom'
import { dashify } from '../string/dashify'
import { getChildren } from './getChildren'

/**
 *
 * @param {NueComp} CompClass
 * @param {string} compName
 */
export const createCompDef = (CompClass, compName) => {
  const compDef = new CompClass()

  compDef._class = CompClass
  compDef._compName = compName
  compDef._elName = dashify(compName)
  compDef._template = /** @type {HTMLTemplateElement}*/ (createElement('template'))
  compDef._children = compDef.uses ? getChildren(compDef.uses) : {}

  return compDef
}
