import devtools from '../../devtools'
import DEV from '../dev/DEV.js'
import addDep from '../state/addDep'
import { addConnects } from './addConnects'

// lay wiring for node updates
function wire (comp, node, deps, update) {
  update.node = node
  const connectNode = () => {
    if (DEV) {
      if (devtools.showUpdates) {
        devtools.onNodeUpdate(node)
      }
    }

    return deps.map(path => addDep(comp, path, update, 'dom'))
  }
  addConnects(node, connectNode)
  if (!node.sweet.updates) node.sweet.updates = []
  node.sweet.updates.push(update)
}

export default wire
