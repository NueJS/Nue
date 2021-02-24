import devtools from '../../apis/devtools'
import DEV from '../dev/DEV.js'
import { subscribeMultiple } from '../state/subscribe'
import { addConnects } from './addConnects'

// lay wiring for node updates
function wire (nue, node, deps, update) {
  // attach which node the update method is for so that when the update is called in queue
  // it can check whether to invoke it node based on whether the node is connected or not to the state
  update.node = node
  const connectNode = () => {
    if (DEV) {
      if (devtools.showUpdates) {
        devtools.onNodeUpdate(node)
      }
    }

    // return removeDeps
    return subscribeMultiple(nue, deps, update, 'dom')
  }
  addConnects(node, connectNode)
  if (!node.parsed.updates) node.parsed.updates = []
  node.parsed.updates.push(update)
}

export default wire
