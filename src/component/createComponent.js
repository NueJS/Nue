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
  const { _components } = data

  // get the name of CompClass
  const compName = CompClass.name

  // do nothing if a component by this name is already defined
  if (compName in _components) return

  const compDef = createCompDef(CompClass)

  // save the def in data
  _components[compName] = compDef

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

  const { _elName, components } = compDef

  // define component and then it's used child components
  customElements.define(_elName, NueComp)

  if (components) {
    components.forEach(createComponent)
  }
}
