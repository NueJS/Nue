import { subscribeMultiple } from '../state/subscribe.js'
import errors from '../dev/errors.js'
import DEV from '../dev/DEV.js'
import { AFTER_UPDATE_CBS, BEFORE_DOM_BATCH, BEFORE_UPDATE_CBS, ON_DESTROY_CBS, ON_MOUNT_CBS } from '../constants.js'

export const runEvent = (compNode, name, batchInfo) => compNode[name].forEach(cb => cb(batchInfo))

const addLifecycles = (node) => {
  // lifecycle methods
  // @todo use set instead for quick removal ?
  node[ON_MOUNT_CBS] = []
  node[ON_DESTROY_CBS] = []
  node[BEFORE_UPDATE_CBS] = []
  node[AFTER_UPDATE_CBS] = []

  const add = (name, cb) => node[name].push(cb)

  node.events = {
    onMount: (cb) => add(ON_MOUNT_CBS, cb),
    onDestroy: (cb) => add(ON_DESTROY_CBS, cb),
    beforeUpdate: (cb) => add(BEFORE_UPDATE_CBS, cb),
    afterUpdate: (cb) => add(AFTER_UPDATE_CBS, cb),

    onMutate: (cb, ...slices) => {
      if (DEV && !slices.length) {
        throw errors.MISSING_DEPENDENCIES_IN_ON_MUTATE(node.name)
      }

      // add the state dependency after the component is mounted
      const subOnMount = () => {
        const deps = slices.map(slice => slice.split('.'))
        subscribeMultiple(node, deps, cb, BEFORE_DOM_BATCH)
      }

      add(ON_MOUNT_CBS, subOnMount)
    }
  }
}

export default addLifecycles
