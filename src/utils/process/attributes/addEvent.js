import { addConnects } from '../../connection/addConnects.js'
import DEV from '../../dev/DEV.js'
import errors from '../../dev/errors.js'

function addEvent (nue, node, info) {
  const { name, placeholder } = info
  const { actions } = nue.component

  const action = actions && actions[name]
  const fnName = placeholder.fnName
  const handler = nue.fn[fnName]

  if (DEV && !handler) throw errors.METHOD_NOT_FOUND(nue.name, fnName)

  // ex: @swipe-left=[moveLeft]
  let connect
  if (action) {
    connect = () => action(node, handler)
  }

  // ex: @click=[increment]
  else {
    connect = () => {
      node.addEventListener(name, handler)
      return () => node.removeEventListener(name, handler)
    }
  }
  addConnects(node, connect)
}

export default addEvent
