import traverse from '../node/traverse.js'
import connectNode from './connectNode'
import disconnectNode from './disconnectNode'

export const disconnectTree = (node, ignoreRoot) => {
  traverse(node, disconnectNode, ignoreRoot)
}

export const connectTree = (node, ignoreRoot) => {
  traverse(node, connectNode, ignoreRoot)
}
