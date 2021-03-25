import { errors } from '../../dev/errors.js'
import { addSubscriber } from '../../subscription/node.js'

/**
 * add event on target target
 * @param {import('types/dom').Parsed_HTMLElement} target
 * @param {import('types/parsed').Attribute_ParseInfo} attribute
 * @param {import('types/dom').Comp} comp
 */
export const hydrateEvent = (target, attribute, comp) => {
  const fnName = /** @type {string}*/ (attribute._placeholder)
  const eventName = attribute._name
  const fn = comp.fn[fnName]

  if (_DEV_ && !fn) {
    throw errors.METHOD_NOT_FOUND(comp._compFnName, fnName)
  }

  /** @type {EventListener} */
  const handleEvent = (e) => fn(e, comp.$)

  const subscriber = () => {
    target.addEventListener(eventName, handleEvent)
    return () => target.removeEventListener(eventName, handleEvent)
  }

  addSubscriber(target, subscriber)
}
