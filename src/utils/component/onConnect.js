
import { subscribeNode } from '../subscription/node'
import { onFirstConnect } from './connectedCallback/onFirstConnect'
/**
 *
 * @param {Comp} comp
 * @param {CompDef} compDef
 * @returns
 */

export const onConnect = (comp, compDef) => {

  // do nothing if component is just moving
  if (comp._moving) return

  comp._manuallyDisconnected = false

  const { _nodesUsingLocalState, _nodesUsingClosureState, _eventCbs, shadowRoot } = comp

  // when comp is being connected for the first time
  if (!shadowRoot) {
    onFirstConnect(comp, compDef)

    // connect all nodes using local state
    _nodesUsingLocalState.forEach(subscribeNode)
  }

  else {
    // only connect nodes that were previously disconnected
    // connect all nodes using closure state
    _nodesUsingClosureState.forEach(subscribeNode)
  }

  // after all the connections are done, run the onMount callbacks
  _eventCbs._onMount.forEach(cb => cb())
}
