import { disconnect } from '../../../connection/recursive'
import DEV from '../../../dev/DEV'
import { animate, onAnimationEnd } from '../../../node/dom'
import updateAnchor from './updateAnchor'

export function removeGroup (group) {
  const { anchorNode, exit, lastNode, nodes } = group

  nodes.forEach(disconnect)

  const remove = () => {
    group.nodes.forEach(node => node.remove())
    group.isRendered = false

    if (DEV) {
      updateAnchor(anchorNode, ' ❌ ')
    }
  }

  if (exit) {
    nodes.forEach(node => animate(node, exit))
    onAnimationEnd(lastNode, remove)
  } else {
    remove()
  }
}

export default removeGroup
