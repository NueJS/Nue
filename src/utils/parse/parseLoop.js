import { ENTER_ANIMATION, EXIT_ANIMATION, FOR_ATTRIBUTE, KEY_ATTRIBUTE, PARSED, REORDER_TRANSITION } from '../constants'
// import DEV from '../dev/DEV'
import { getAttr, removeAttr, getAnimationAttributes } from '../node/dom'
import { isDefined } from '../others'
import processPlaceholder from '../string/placeholder/processPlaceholder'
// import { checkParsedLoop } from './checkParsed'

/** @typedef {import('../types').compNode} compNode*/

/**
 *
 * @param {compNode} compNode
 * @param {string} forAttribute
 */
const parseLoop = (compNode, forAttribute) => {
  // replace ' in ', '(' ')' ',' with space, split with space, and remove empty strings
  const [a, b, c] = forAttribute.replace(/\(|\)|,|(\sin\s)/g, ' ').split(/\s+/).filter(t => t)
  // ['item', 'index', 'arr']
  // ['item', 'arr']
  const indexUsed = isDefined(c)

  compNode[PARSED].for = {
    itemArray: processPlaceholder(indexUsed ? c : b, true),
    item: a,
    itemIndex: indexUsed ? b : undefined,
    key: processPlaceholder(getAttr(compNode, KEY_ATTRIBUTE)),
    ...getAnimationAttributes(compNode),
    reorder: getAttr(compNode, REORDER_TRANSITION)
  };

  // if (DEV) checkParsedLoop(parsingInfo.component, compNode, info);
  [
    EXIT_ANIMATION,
    ENTER_ANIMATION,
    REORDER_TRANSITION,
    FOR_ATTRIBUTE,
    KEY_ATTRIBUTE
  ].forEach(name => removeAttr(compNode, name))
}

export default parseLoop
