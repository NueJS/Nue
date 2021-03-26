import { ELSE_ATTRIBUTE, IF_ATTRIBUTE } from '../../constants'
import { createComment } from '../node/dom'

/**
 * parse if condition comp
 * @param {import('types/dom').IfComp} ifComp
 */
export const parseIfComp = (ifComp) => {
  /** @type {import('types/dom').ConditionalComp[]}} */
  const conditionGroup = []

  let node = /** @type {import('types/dom').ConditionalComp | Node } */(ifComp.nextElementSibling)

  // create a starting marker which will be used to add conditional nodes to DOM
  const anchorNode = createComment('if')
  ifComp.before(anchorNode)

  // keep checking the next node
  while (true) {
    // get the conditionType of the node

    // @ts-expect-error
    const type = node && node._parsedInfo && node._parsedInfo._conditionType

    // if the node is not a condition node or is a separate condition, break the loop
    if (!type || (type === IF_ATTRIBUTE)) break

    conditionGroup.push(/** @type {import('types/dom').ConditionalComp } */(node))

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
    if (node._parsedInfo._conditionType !== ELSE_ATTRIBUTE) {
      conditionGroupStateDeps.push(
        /** @type {import('types/dom').IfComp | import('types/dom').ElseIfComp }*/
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
