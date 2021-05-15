import { errors } from '../../dev/errors'
import { addSubscriber } from '../../subscription/node'

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

  /** @type {EventListener} */
  const handleEvent = (e) => fn(e, comp.$)

  const subscriber = () => {
    target.addEventListener(eventName, handleEvent)
    return () => target.removeEventListener(eventName, handleEvent)
  }

  addSubscriber(target, subscriber)
}
