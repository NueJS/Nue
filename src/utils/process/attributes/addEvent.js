import { addConnects } from '../../connection/addConnects.js'
import DEV from '../../dev/DEV.js'
import errors from '../../dev/errors.js'

function addEvent (comp, node, info) {
  const { name, placeholder } = info
  const { actions } = comp.component

  const action = actions && actions[name]
  const fnName = placeholder.fnName
  const handler = comp.fn[fnName]

  if (DEV && !handler) throw errors.METHOD_NOT_FOUND(comp, fnName)

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
