import { devInfo } from '../../dev/devInfo'
import { batches } from '../../enums'
import { subscribeMultiple } from '../subscribeMultiple'
import { registerSubscriber } from './registerSubscriber'

/**
 * keep the node in sync with comp's state
 * by calling the update callback when its deps change in state of comp
 * @param {Comp} comp
 * @param {ParsedDOMNode} node
 * @param {StatePath[]} statePaths
 * @param {Function} updateNode
 */

export const syncNode = (node, statePaths, updateNode, comp) => {

  const update = () => {
    if (node._isSubscribed) {
      updateNode()
      if (_DEV_) devInfo.nodeUpdated(node)
    }
  }

  /** @type {Subscriber} */
  const subscriber = () => {
    update()
    return subscribeMultiple(statePaths, comp, update, batches._DOM, node)
  }

  registerSubscriber(node, subscriber)
}
