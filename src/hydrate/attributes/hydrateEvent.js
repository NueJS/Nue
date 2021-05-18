import { errors } from '../../dev/errors/index.js'
import { registerSubscriber } from '../../subscription/node/registerSubscriber'

/**
 * add event on target target
 * @param {Parsed_HTMLElement} target
 * @param {Attribute_ParseInfo} attribute
 * @param {Comp} comp
 */
export const hydrateEvent = (target, attribute, comp) => {
  const fnName = /** @type {string}*/ (attribute._placeholder)
  const eventName = attribute._name
  const fn = comp.fn[fnName]

  if (_DEV_ && !fn) {
    throw errors.event_handler_not_found(comp._compName, fnName)
  }

  // call the event listener with the event and state of component which the node is child of
  /** @type {EventListener} */
  const handleEvent = (event) => fn(event, comp.$)

  /** @type {Subscriber} */
  const subscriber = () => {
    target.addEventListener(eventName, handleEvent)
    return () => target.removeEventListener(eventName, handleEvent)
  }

  registerSubscriber(target, subscriber)
}
