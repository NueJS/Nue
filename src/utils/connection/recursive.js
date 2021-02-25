import traverse from '../node/traverse.js'
import connectNode from './connectNode'
import disconnectNode from './disconnectNode'

export function disconnectTree (node, ignoreRoot) {
  traverse(node, disconnectNode, ignoreRoot)
}

export function connectTree (node, ignoreRoot) {
  traverse(node, connectNode, ignoreRoot)
}
