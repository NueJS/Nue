import { data } from '../data'
import { createCompDef } from './createCompDef'
import { createCompTemplate } from './createCompTemplate'
import { construct } from './onCreate'
import { onConnect } from './onConnect'
import { onDisconnect } from './onDisconnect'

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
    /** @this {Comp} */
    constructor () {
      super()
      construct(this, compName)
    }

    /** @this {Comp} */
    connectedCallback () {
      onConnect(this, compDef)
    }

    /** @this {Comp} */
    disconnectedCallback () {
      onDisconnect(this)
    }
  }

  // define component and then it's used child components
  customElements.define(compDef._elName, NueComp)

  if (compDef.components) compDef.components.forEach(createComponent)
}
