// connectNode the node to state
export function connectNode (node) {
  if (!node.parsed) return
  const { parsed } = node

  // if node is connected, do nothing
  if (node.isSubscribed) return
  // if node can be connected
  if (parsed.connects) {
    // collect disconnects which is returned when calling connects
    const disconnects = []

    // calling connectNode creates new disconnects which needs to be replaced
    parsed.connects.forEach(connectNode => {
      const disconnectNode = connectNode()
      if (Array.isArray(disconnectNode)) disconnectNode.forEach(dc => disconnects.push(dc))
      else disconnects.push(disconnectNode)
    })

    // set the new disconnects
    parsed.disconnects = disconnects

    // update() will/should not work unless isSubscribed is set to true
    // so set it to true first and then update
    node.isSubscribed = true
    parsed.updates && parsed.updates.forEach(u => u())
  }
}

export default connectNode
