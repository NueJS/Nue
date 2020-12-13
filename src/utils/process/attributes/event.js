import { supersweet } from '../../../index.js'

function process_event_attribute (node, info) {
  const { name, placeholder } = info
  const action = supersweet.actions[name]
  const handler = this.fn[placeholder.content]

  // check if the function is valid
  // @TODO move this in dev condition
  if (!handler) throw new Error(`"ERROR in <${this.nodeName}>'s <${node.nodeName}> : "${placeholder.content}" is not defined`)

  // @customAction=[handler]
  if (action) {
    const cleanup = action(node, handler)
    if (!node.di.supersweet.connects) node.di.supersweet.connects = cleanup
    else node.di.supersweet.connects.push(cleanup)
  }

  // @nativeEvent=[handler]
  else node.addEventListener(name, handler)
}

export default process_event_attribute
