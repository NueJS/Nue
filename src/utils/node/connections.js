// call this function only once per node
// .supersweet.connects array is static and does not need to be changed because it only adds the callback in deps
// .supersweet.disconnects array functions removes the added fn from deps, since each time it can be added in different place
// it has to be updated when a fn from.supersweet.connects array is ran
// IS THIS RIGHT ? THINK ABOUT IT

export function addConnects (node, connect) {
  if (!node.supersweet.connects) node.supersweet.connects = []
  if (!node.supersweet.disconnects) node.supersweet.disconnects = []

  node.supersweet.connects.push(connect)
  node.supersweet.isConnected = true

  const disconnect = connect()
  console.log('connected : ', node, disconnect)
  if (Array.isArray(disconnect)) disconnect.forEach(dc => node.supersweet.disconnects.push(dc))
  else node.supersweet.disconnects.push(disconnect)
}

export function connect (node) {
  // if node is connected, do nothing
  if (node.supersweet.isConnected) return

  // if node has.supersweet.connects
  if (node.supersweet.connects) {
    const disconnects = []

    // calling connect adds deps to deps which also returns new.supersweet.disconnects
    node.supersweet.connects.forEach(connect => {
      const disconnect = connect()

      if (Array.isArray(disconnect)) disconnect.forEach(dc => disconnects.push(dc))
      else disconnects.push(disconnect)
    })

    // console.log({ disconnects })
    node.supersweet.disconnects = disconnects
    // when connecting to state, update its value to keep itself in sync with new state
    // make it connected, and THEN attempt to update it
    node.supersweet.isConnected = true
    node.supersweet.update()
  }
}

export function disconnect (node) {
  // if node is disconnected from state already, do nothing
  if (!node.supersweet.isConnected) return

  // if node has.supersweet.disconnects
  if (node.supersweet.disconnects) {
    console.log('disconnected: ', node)
    node.supersweet.disconnects.forEach(dc => dc())
    node.supersweet.isConnected = false
  }
}
