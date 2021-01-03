// connectNode the node to state
// add the node's deps in this.deps
// invoke update to update the node
export function connectNode (node) {
  if (!node.sweet) return
  const { sweet } = node
  // if node is connected, do nothing
  if (sweet.isConnected) return

  // if node can be connected
  if (sweet.connects) {
    // collect disconnects which is returned when calling connects
    const disconnects = []

    // calling connectNode creates new disconnects which needs to be replaced
    sweet.connects.forEach(connectNode => {
      const disconnectNode = connectNode()
      if (Array.isArray(disconnectNode)) disconnectNode.forEach(dc => disconnects.push(dc))
      else disconnects.push(disconnectNode)
    })

    // set the new disconnects
    sweet.disconnects = disconnects

    // update() will/should not work unless isConnected is set to true
    // so set it to true first and then update
    sweet.isConnected = true
    sweet.updates && sweet.updates.forEach(u => u())
  }
}

export default connectNode
