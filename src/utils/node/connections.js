export function add_connects (node, connect) {
  if (!node.connects) node.connects = []
  if (!node.disconnects) node.disconnects = []
  node.connects.push(connect)
  const disconnect = connect()
  if (Array.isArray(disconnect)) disconnect.forEach(dc => node.disconnects.push(dc))
  else node.disconnects.push(disconnect)
}

export function connect (node) {
  const disconnects = []
  if (node.connects) {
    node.connects.forEach(connect => {
      const disconnect = connect()
      if (Array.isArray(disconnect)) {
        disconnect.forEach(dc => disconnects.push(dc))
      }
      else disconnects.push(disconnect)
    })
  }

  node.disconnects = disconnects
}

export function disconnect (node) {
  if (node.disconnects) {
    node.disconnects.forEach(dc => dc())
  }
}
