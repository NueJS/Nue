function process_event_attribute (node, info) {
  // // console.log({ info })
  const { name, placeholder } = info
  const action = this.actions[name]
  const handler = this.fn[placeholder.content]

  //
  if (handler === undefined) throw new Error(`function "${placeholder.content}" is not defined`)

  // @customEvent=[handler] action API
  if (action) {
    const cleanup = action(node, handler)
    node.onRemove = cleanup
    this.on.remove(cleanup)
  }

  // @nativeEvent=[handler]
  else {
    node.addEventListener(name, handler)
    const cleanup = () => node.removeEventListener(name, handler)
    this.on.remove(cleanup)
    // node.onRemove(cleanup)
  }
}

export default process_event_attribute
