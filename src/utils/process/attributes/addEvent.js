import { addSubscriber } from '../../connection/addSubscriber.js'
import DEV from '../../dev/DEV.js'
import errors from '../../dev/errors.js'

const addEvent = (compNode, node, [fnName, eventName]) => {
  const handler = compNode.fn[fnName]
  if (DEV && !handler) throw errors.METHOD_NOT_FOUND(compNode.name, fnName)

  const { actions } = compNode.component
  const action = actions && actions[eventName]

  // handler gets called with event and the state of component event is originated from
  const _handler = (e) => handler(e, compNode.$)

  let subscriber
  if (action) {
    subscriber = () => action(node, _handler)
  }

  else {
    subscriber = () => {
      node.addEventListener(eventName, _handler)
      return () => node.removeEventListener(eventName, _handler)
    }
  }

  addSubscriber(node, subscriber)
}

export default addEvent
