import { unsubscribeNode } from '../subscription/node'

/**
 * called when comp is disconnected
 * @param {Comp} comp
 */
export const onDisconnect = (comp) => {
  const { _eventCbs, _nodesUsingClosureState, _manuallyDisconnected, _moving } = comp

  if (_manuallyDisconnected || _moving) return

  _nodesUsingClosureState.forEach(unsubscribeNode)

  _eventCbs._onDestroy.forEach(cb => cb())

}
