// call this function only once per node
// .sweet.connects array is static and does not need to be changed because it only adds the callback in deps
// .sweet.disconnects array functions removes the added fn from deps, since each time it can be added in different place
// it has to be updated when a fn from.sweet.connects array is ran
// IS THIS RIGHT ? THINK ABOUT IT

import addDep from '../slice/addDep.js'

export function setupConnection (node, deps, update) {
  const connect = () => deps.map(path => addDep.call(this, path, update, 'dom'))
  addConnects(node, connect)
  node.sweet.update = update
  update()
}

export function addConnects (node, connect) {
  if (!node.sweet.connects) node.sweet.connects = []
  if (!node.sweet.disconnects) node.sweet.disconnects = []

  node.sweet.connects.push(connect)
  node.sweet.isConnected = true

  const disconnect = connect()
  if (Array.isArray(disconnect)) disconnect.forEach(dc => node.sweet.disconnects.push(dc))
  else node.sweet.disconnects.push(disconnect)
}

export function connect (node) {
  const { sweet } = node
  // if node is connected, do nothing
  if (sweet.isConnected) return

  // if node has.sweet.connects
  if (sweet.connects) {
    const disconnects = []

    // calling connect creates new disconnects which needs to be replaced
    sweet.connects.forEach(connect => {
      const disconnect = connect()
      if (Array.isArray(disconnect)) disconnect.forEach(dc => disconnects.push(dc))
      else disconnects.push(disconnect)
    })

    sweet.disconnects = disconnects

    // update will/should not work unless isConnected is set to true
    sweet.isConnected = true
    sweet.update && sweet.update()
  }
}

export function disconnect (node) {
  // if node is disconnected from state already, do nothing
  if (!node.sweet.isConnected) return

  // if node has.sweet.disconnects
  if (node.sweet.disconnects) {
    node.sweet.disconnects.forEach(dc => dc())
    node.sweet.isConnected = false
  }
}
