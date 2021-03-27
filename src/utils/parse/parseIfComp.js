import { conditionAttributes } from '../../constants'
import { createComment } from '../node/dom'

/**
 * parse if condition comp
 * @param {IfComp} ifComp
 */
export const parseIfComp = (ifComp) => {
  /** @type {ConditionalComp[]}} */
  const conditionGroup = []

  let node = /** @type {ConditionalComp | Node } */(ifComp.nextElementSibling)

  // create a starting marker which will be used to add conditional nodes to DOM
  const anchorNode = createComment('if')
  ifComp.before(anchorNode)

  // keep checking the next node
  while (true) {
    // get the conditionType of the node

    // @ts-expect-error
    const type = node && node._parsedInfo && node._parsedInfo._conditionType

    // if the node is not a condition node or is a separate condition, break the loop
    if (!type || (type === conditionAttributes._if)) break

    conditionGroup.push(/** @type {ConditionalComp } */(node))

    // @ts-expect-error
    node = node.nextElementSibling
  }

  // add a end if marker after the last node in conditionGroup
  // if ifComp is alone, add after it
  (conditionGroup[conditionGroup.length - 1] || ifComp).after(createComment('/if'))

  // remove other nodes from template
  conditionGroup.forEach(n => n.remove())

  const conditionGroupStateDeps = [ifComp._parsedInfo._conditionAttribute._stateDeps]
  conditionGroup.forEach(node => {
    if (node._parsedInfo._conditionType !== conditionAttributes._else) {
      conditionGroupStateDeps.push(
        /** @type {IfComp | ElseIfComp }*/
        (node)._parsedInfo._conditionAttribute._stateDeps
      )
    }
  })

  ifComp._parsedInfo = {
    ...ifComp._parsedInfo,
    _conditionGroup: conditionGroup,
    _conditionGroupStateDeps: conditionGroupStateDeps,
    _conditionGroupAnchor: anchorNode
  }
}
