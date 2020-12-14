import { supersweet } from '../../../index.js'
import { addConnects } from '../../node/connections.js'

function addEvent (node, info) {
  const { name, placeholder } = info
  const action = supersweet.actions[name]
  const handler = this.fn[placeholder.content]

  // @TODO move this in dev condition
  if (!handler) throw new Error(`"ERROR in <${this.nodeName}>'s <${node.nodeName}> : "${placeholder.content}" function is not defined`)

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
