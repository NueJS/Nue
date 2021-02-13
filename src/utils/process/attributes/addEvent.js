import { addConnects } from '../../connection/addConnects.js'
import DEV from '../../dev/DEV.js'
import err from '../../dev/error.js'

function addEvent (comp, node, info) {
  const { name, placeholder } = info
  const { actions } = comp.memo.component

  const action = actions && actions[name]
  const fnName = placeholder.fnName
  const handler = comp.fn[fnName]

  if (DEV) {
    if (!handler) {
      throw {
        message: `invalid method "${placeholder.fnName}" used`,
        link: '',
        code: -1,
        comp
      }
    }
  }

  // ex: @swipe-left=[moveLeft]
  if (action) {
    const connect = () => action(node, handler)
    addConnects(node, connect)
  }

  // ex: @click=[increment]
  else {
    const connect = () => {
      node.addEventListener(name, handler)
      return () => node.removeEventListener(name, handler)
    }

    addConnects(node, connect)
  }
}

export default addEvent
