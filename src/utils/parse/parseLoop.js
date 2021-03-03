import { ENTER_ANIMATION, EXIT_ANIMATION, FOR_ATTRIBUTE, KEY_ATTRIBUTE, PARSED, REORDER_TRANSITION } from '../constants'
// import DEV from '../dev/DEV'
import { attr, removeAttr } from '../node/dom'
import { isDefined } from '../others'
import processPlaceholder from '../string/placeholder/processPlaceholder'
// import { checkParsedLoop } from './checkParsed'

const parseLoop = (node, forAttribute) => {
  // replace ' in ', '(' ')' ',' with space, split with space, and remove empty strings
  const [a, b, c] = forAttribute.replace(/\(|\)|,|(\sin\s)/g, ' ').split(/\s+/).filter(t => t)
  // ['item', 'index', 'arr']
  // ['item', 'arr']
  const indexUsed = isDefined(c)

  node[PARSED].for = {
    // @todo rename map to itemArray
    map: processPlaceholder(indexUsed ? c : b, true),
    // @todo rename to itemValue
    as: a,
    // @todo rename to itemIndex
    at: indexUsed && b,
    key: processPlaceholder(attr(node, KEY_ATTRIBUTE)),
    // @todo wrap in animations object ?
    enter: attr(node, ENTER_ANIMATION),
    reorder: attr(node, REORDER_TRANSITION),
    exit: attr(node, EXIT_ANIMATION)
  };

  // if (DEV) checkParsedLoop(parsingInfo.component, node, info);
  [
    EXIT_ANIMATION,
    ENTER_ANIMATION,
    REORDER_TRANSITION,
    FOR_ATTRIBUTE,
    KEY_ATTRIBUTE
  ].forEach(name => removeAttr(node, name))
}

export default parseLoop
