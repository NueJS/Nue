function process_event_attribute (node, info) {
  const { name, value } = info
  const action = this.actions[name]
  const handler = this.fn[value]
  //
  if (handler === undefined) return

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
