import { ENTER_ATTRIBUTE, EXIT_ATTRIBUTE, FOR_ATTRIBUTE, KEY_ATTRIBUTE, MOVE_ATTRIBUTE } from '../../constants'
import { getAttr, removeAttr } from '../node/dom'
import { isDefined } from '../others'
import { processPlaceholder } from '../string/placeholder/processPlaceholder'

/**
 * parse looped component
 * @param {import('types/dom').LoopedComp} comp
 * @param {string} forAttribute
 */
export const parseLoopedComp = (comp, forAttribute) => {
  // replace ' in ', '(' ')' ',' with space, split with space, and remove empty strings
  const [a, b, c] = forAttribute.replace(/\(|\)|,|(\sin\s)/g, ' ').split(/\s+/).filter(t => t)

  // ['item', 'index', 'arr']
  // ['item', 'arr']
  const indexUsed = isDefined(c)

  comp._parsedInfo._loopAttributes = {
    _itemArray: processPlaceholder(indexUsed ? c : b, true),
    _item: a,
    _itemIndex: indexUsed ? b : undefined,
    _key: processPlaceholder(/** @type {string}*/(getAttr(comp, KEY_ATTRIBUTE)))
  };

  [
    EXIT_ATTRIBUTE,
    ENTER_ATTRIBUTE,
    MOVE_ATTRIBUTE,
    FOR_ATTRIBUTE,
    KEY_ATTRIBUTE
  ].forEach(name => removeAttr(comp, name))
}
