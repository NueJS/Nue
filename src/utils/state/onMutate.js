import flush from '../flush.js'
import { triggerDeps } from '../callbacks.js'
import { IS_BATCHING } from '../constants.js'

// when state is mutated
// if the batching is complete flush the changes to DOM
// else build the batch
const onMutate = (compNode, path) => {
  // don't flush if the batch is not complete
  if (!compNode[IS_BATCHING]) flush(compNode)
  // ** don't use if else here **
  // value of compNode[IS_BATCHING] may be be changed if flush() is called
  if (compNode[IS_BATCHING]) triggerDeps(compNode.subscriptions, path)
}

export default onMutate
