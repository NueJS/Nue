import { createElement } from '../dom/create'
import { dashify } from '../string/dashify'
import { getChildren } from './getChildren'

/**
 * create component definition using the CompClass
 * @param {NueComp} CompClass
 */
export const createCompDef = (CompClass) => {
  const compDef = new CompClass()
  const compName = CompClass.name

  compDef._class = CompClass
  compDef._compName = compName
  compDef._elName = dashify(compName)
  compDef._template = /** @type {HTMLTemplateElement}*/ (createElement('template'))
  compDef._children = compDef.components ? getChildren(compDef.components) : {}

  return compDef
}
