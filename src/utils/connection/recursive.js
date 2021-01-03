import traverse from '../node/traverse.js'
import connectNode from './connectNode'
import disconnectNode from './disconnectNode'

export function disconnect (node, ignoreRoot) {
  traverse(node, disconnectNode, ignoreRoot)
}

export function connect (node, ignoreRoot) {
  traverse(node, connectNode, ignoreRoot)
}
