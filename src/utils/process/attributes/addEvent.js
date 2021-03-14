import DEV from '../../dev/DEV.js'
import errors from '../../dev/errors.js'
import { addSubscriber } from '../../subscription/node.js'

/**
 * add event listener on element
 * @param {import('../../types').compNode} compNode
 * @param {Element} element
 * @param {import('../../types').attribute} param2
 */
const addEvent = (compNode, element, [fnName, eventName]) => {
  const handler = compNode.fn[fnName]
  if (DEV && !handler) throw errors.METHOD_NOT_FOUND(compNode.name, fnName)

  /** @type {EventListener} */
  const _handler = (e) => handler(e, compNode.$)

  const subscriber = () => {
    element.addEventListener(eventName, _handler)
    return () => element.removeEventListener(eventName, _handler)
  }

  addSubscriber(element, subscriber)
}

export default addEvent
