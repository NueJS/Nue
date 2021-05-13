import { data } from '../data'
import { dashify } from '../string/dashify.js'
import { createElement } from '../node/dom'
import { createCompTemplate } from './connectedCallback/createCompTemplate'
import { getChildren } from './getChildren'
import { onConnect } from './onConnect'
import { onDisconnect } from './onDisconnect'
import { construct } from './onCreate'

/**
 * defines a custom element using the CompClass function
 * @param {NueComp} CompClass
 */

export const createComponent = CompClass => {
  const { _definedComponents } = data

  // get the name of CompClass
  const compName = CompClass.name

  // do nothing if a component by this name is already defined
  if (compName in _definedComponents) return

  // else, mark this as defined
  _definedComponents[compName] = CompClass

  const compDef = createCompDef(CompClass, compName)

  createCompTemplate(compDef)

  // create a custom element for this component

  class NueComp extends HTMLElement {
    constructor () {
      super()
      // @ts-expect-error
      construct(this, compName)
    }

    connectedCallback () {
      // @ts-expect-error
      onConnect(this, compDef)
    }

    disconnectedCallback () {
      // @ts-expect-error
      onDisconnect(this)
    }
  }

  // define component and then it's used child components
  customElements.define(compDef._elName, NueComp)

  if (compDef.uses) compDef.uses.forEach(createComponent)
}

/**
 *
 * @param {NueComp} CompClass
 * @param {string} compName
 */
const createCompDef = (CompClass, compName) => {
  const compDef = new CompClass()

  compDef._class = CompClass
  compDef._compName = compName
  compDef._elName = dashify(compName)
  compDef._template = /** @type {HTMLTemplateElement}*/ (createElement('template'))
  compDef._children = compDef.uses ? getChildren(compDef.uses) : {}

  return compDef
}
