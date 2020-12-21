import addDep from '../state/addDep.js'
import traverse from './traverse.js'

// lay wiring for node updates
export function wire (node, deps, update) {
  update.node = node
  const connectNode = () => deps.map(path => addDep.call(this, path, update, 'dom'))
  addConnects(node, connectNode)
  if (!node.sweet.updates) node.sweet.updates = []
  node.sweet.updates.push(update)
}

// add connects and disconnects on node
// this is only called when the node is first processed, not as response to any user action
// this is different from connectNode and disconnectNode which may be called as node is added and removed from DOM
export function addConnects (node, connectNode) {
  const { sweet } = node
  if (!sweet.connects) sweet.connects = []
  if (!sweet.disconnects) sweet.disconnects = []
  sweet.connects.push(connectNode)
}

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

// disconnectNode the node from state
// after disconnecting, no state mutation should affect the node
// disconnecting involves removing its dep from this.deps map
export function disconnectNode (node) {
  if (!node.sweet) return
  const { sweet } = node
  // if node is disconnected from state already, do nothing
  if (!sweet.isConnected) return

  // if the node can be disconnected
  if (sweet.disconnects) {
    sweet.disconnects.forEach(dc => dc())
    sweet.isConnected = false
  }
}

export function disconnect (node, ignoreRoot) {
  traverse(node, disconnectNode, ignoreRoot)
}

export function connect (node, ignoreRoot) {
  traverse(node, connectNode, ignoreRoot)
}
