import { addSubscriber } from '../../connection/addSubscriber.js'
import DEV from '../../dev/DEV.js'
import errors from '../../dev/errors.js'

const addEvent = (nue, node, info) => {
  const { name, placeholder: fnName } = info

  const handler = nue.fn[fnName]
  if (DEV && !handler) throw errors.METHOD_NOT_FOUND(nue.name, fnName)

  const { actions } = nue.common.component
  const action = actions && actions[name]

  // handler gets called with event and the state of component event is originated from
  const _handler = (e) => handler(e, nue.$)

  let subscriber
  if (action) {
    subscriber = () => action(node, _handler)
  }

  else {
    subscriber = () => {
      node.addEventListener(name, _handler)
      return () => node.removeEventListener(name, _handler)
    }
  }

  addSubscriber(node, subscriber)
}

export default addEvent
