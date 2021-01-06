import devtools from '../../apis/devtools'
import DEV from '../dev/DEV.js'
import { addDeps } from '../state/addDep'
import { addConnects } from './addConnects'

// lay wiring for node updates
function wire (comp, node, deps, update) {
  // attach which node the update method is for so that when the update is called in queue
  // it can check whether to invoke it self based on whether the node is connected or not to the state
  update.node = node
  const connectNode = () => {
    if (DEV) {
      if (devtools.showUpdates) {
        devtools.onNodeUpdate(node)
      }
    }

    return addDeps(comp, deps, update, 'dom')
    // return deps.map(path => addDep(comp, path, update, 'dom'))
  }
  addConnects(node, connectNode)
  if (!node.sweet.updates) node.sweet.updates = []
  node.sweet.updates.push(update)
}

export default wire
