import { supersweet } from '../../../index.js'
import getFn from '../../closure.js'
import err from '../../dev/error.js'
import { addConnects } from '../../node/connections.js'

function addEvent (comp, node, info) {
  const { name, placeholder } = info
  const action = supersweet.actions[name]

  const fnName = placeholder.content
  const handler = getFn(comp, fnName)

  if (process.env.NODE_ENV !== 'production') {
  // @TODO move this in dev condition
    if (!handler) {
      throw err({
        message: `"ERROR in <${comp.nodeName}>'s <${node.nodeName}> : "${placeholder.content}" function is not defined`,
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
