import { unsubscribeNode } from '../subscription/node/unsubscribeNode'

/**
 * called when comp is disconnected
 * @param {Comp} comp
 */
export const onDisconnect = (comp) => {
  const { _eventCbs, _nodesUsingNonLocalState, _manuallyDisconnected, _moving } = comp

  if (_manuallyDisconnected || _moving) return

  _nodesUsingNonLocalState.forEach(unsubscribeNode)

  _eventCbs._onDestroy.forEach(cb => cb())

}
