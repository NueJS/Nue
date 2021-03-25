import { subscribeMultiple } from '../subscription/subscribe.js'
import { hydrate } from './hydrate.js'
import { animate, animatedRemove, onAnimationEnd } from '../node/dom.js'
import { getParsedClone } from '../node/clone.js'
import { batches } from 'enums.js'

/**
 * add conditional rendering
 * @param {import('types/dom').IfComp} ifComp
 * @param {import('types/dom').Comp} parentComp
 */
export const hydrateIfComp = (ifComp, parentComp) => {
  const parsed = ifComp._parsedInfo

  /** @type {import('types/dom').ConditionalComp[]} */
  const group = [ifComp]

  if (parsed._conditionGroup) parsed._conditionGroup.forEach(node => group.push(getParsedClone(node)))

  ifComp._isProcessed = true

  const { _conditionGroupStateDeps } = parsed

  const anchorNode = /** @type {Comment} */(ifComp.previousSibling)

  // group that is currently rendered
  /** @type {import('types/dom').ConditionalComp} */
  let active

  /** @type {boolean} */
  let initialized

  const onGroupDepChange = () => {
    // if a group's condition is foundSatisfied, this becomes true
    let foundSatisfied = false

    group.forEach(conditionNode => {
      const { _isProcessed, isConnected } = conditionNode
      const {
        // @ts-expect-error - it will not be directly used
        _conditionAttribute,
        _animationAttributes
      } = conditionNode._parsedInfo

      const { _enter, _exit } = _animationAttributes

      const satisfied = _conditionAttribute ? _conditionAttribute.getValue(parentComp) : true

      // if this component should be mounted
      if (!foundSatisfied && satisfied) {
        foundSatisfied = true

        // if this node is not mounted, already
        if (!isConnected) {
          // if this node is not processed
          if (!_isProcessed) {
            hydrate(parentComp, conditionNode)
            conditionNode._isProcessed = true
          }

          const mount = () => {
            anchorNode.after(conditionNode)
            if (_enter && initialized) animate(conditionNode, _enter, true)
          }

          // if it should wait for active component's animation to end
          const waitForAnimationEnd = active && active._parsedInfo._animationAttributes._exit && conditionNode !== active

          // wait if needed, else mount it right now
          waitForAnimationEnd ? onAnimationEnd(active, mount) : mount()

          active = conditionNode
        }
      }

      // if the group should be removed
      else if (isConnected) {
        if (_exit) animatedRemove(conditionNode, _exit)
        else conditionNode.remove()
      }
    })
  }

  // since this modifies the DOM, it should be done in dom batches
  // @ts-ignore
  subscribeMultiple(parentComp, _conditionGroupStateDeps, onGroupDepChange, batches._beforeDOM)

  parentComp._deferredWork.push(() => {
    ifComp.remove()
    onGroupDepChange()
    initialized = true
  })
}
