import { subscribe } from './subscribe'

/**
 * subscribe to multiple statePaths
 *
 * @param {StatePath[]} statePaths
 * @param {[Comp, Function, 0 | 1, ParsedDOMNode? ]} rest
 * @returns {Unsubscriber}
 */

export const subscribeMultiple = (statePaths, ...rest) => {
  const unsubscribers = statePaths.map(statePath => subscribe(statePath, ...rest))
  const unsubscriber = () => unsubscribers.forEach(c => c())
  return unsubscriber
}
