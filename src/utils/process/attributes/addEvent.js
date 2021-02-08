import globalInfo from '../../globalInfo.js'
import getFn from '../../closure.js'
import { addConnects } from '../../connection/addConnects.js'
import DEV from '../../dev/DEV.js'
import err from '../../dev/error.js'

function addEvent (comp, node, info) {
  const { name, placeholder } = info
  const action = globalInfo.actions[name]
  const fnName = placeholder.fnName
  const handler = getFn(comp, fnName)

  if (DEV) {
    if (!handler) {
      err({
        message: `invalid method "${placeholder.fnName}" used`,
        link: '',
        code: -1,
        comp
      })
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
