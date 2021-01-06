import DEV from '../../../dev/DEV'
import updateAnchor from './updateAnchor'
import { reverseForEach } from '../../../others'
import devtools from '../../../../apis/devtools'
import { animate } from '../../../node/dom'
import { connect } from '../../../connection/recursive'

// add the group nodes to DOM
const addGroup = (group) => {
  const { anchorNode, enter, nodes } = group

  // add nodes of group in DOM
  reverseForEach(nodes, node => {
    anchorNode.after(node)
    if (enter) animate(node, enter)
    connect(node)

    // show updates
    if (DEV && devtools.showUpdates) devtools.onNodeUpdate(node)
  })

  group.isRendered = true
  if (DEV) updateAnchor(anchorNode, ' ✅ ')
}

export default addGroup
