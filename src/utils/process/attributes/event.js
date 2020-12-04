function process_event_attribute (node, attribute) {
  const action = this.actions[attribute.eventName]
  const handler = this.handle[attribute.handler]

  // @customEvent=[handler] action API
  if (action) {
    const cleanup = action(node, handler)
    node.onRemove = cleanup
    this.on.remove(cleanup)
  }

  // @nativeEvent=[handler]
  else {
    node.addEventListener(attribute.eventName, handler)
    const cleanup = () => node.removeEventListener(attribute.eventName, handler)
    this.on.remove(cleanup)
    // node.onRemove(cleanup)
  }
}

export default process_event_attribute
