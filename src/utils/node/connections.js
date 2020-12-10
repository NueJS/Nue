// call this function only once per node
// connects array is static and does not need to be changed because it only adds the callback in slice_deps
// disconnects array functions removes the added fn from slice_deps, since each time it can be added in different place
// it has to be updated when a fn from connects array is ran
// IS THIS RIGHT ? THINK ABOUT IT

export function add_connects (node, connect) {
  if (!node.connects) node.connects = []
  if (!node.disconnects) node.disconnects = []

  node.connects.push(connect)
  node.connected_to_state = true

  const disconnect = connect()
  if (Array.isArray(disconnect)) disconnect.forEach(dc => node.disconnects.push(dc))
  else node.disconnects.push(disconnect)
}

export function connect (node) {
  // if node is connected, do nothing
  if (node.connected_to_state) return

  // if node has connects
  if (node.connects) {
    const disconnects = []

    // calling connect adds deps to slice_deps which also returns new disconnects
    node.connects.forEach(connect => {
      const disconnect = connect()
      if (Array.isArray(disconnect)) disconnect.forEach(dc => disconnects.push(dc))
      else disconnects.push(disconnect)
    })

    node.disconnects = disconnects
    // when connecting to state, update its value to keep itself in sync with new state
    // make it connected, and THEN attempt to update it
    node.connected_to_state = true
    node.update_value()
  }
}

export function disconnect (node) {
  // if node is disconnected from state already, do nothing
  if (!node.connected_to_state) return

  // if node has disconnects
  if (node.disconnects) {
    node.disconnects.forEach(dc => dc())
    node.connected_to_state = false
  }
}
