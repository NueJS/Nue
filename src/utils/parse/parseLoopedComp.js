import { animationAttributes, loopAttributes } from '../../constants'
import { getAttr, removeAttr } from '../node/dom'
import { isDefined } from '../others'
import { processPlaceholder } from '../string/placeholder/processPlaceholder'

const { _enter, _exit, _move } = animationAttributes
const { _for, _key } = loopAttributes

const attributesToRemove = [
  _enter, _exit, _move,
  _for, _key
]

/**
 * parse looped component
 * @param {LoopedComp} comp
 * @param {string} forAttribute
 */

export const parseLoopedComp = (comp, forAttribute) => {
  // replace ' in ', '(' ')' ',' with space, split with space, and remove empty strings
  const [a, b, c] = forAttribute.replace(/\(|\)|,|(\sin\s)/g, ' ').split(/\s+/).filter(t => t)

  // ['item', 'index', 'arr'] or
  // ['item', 'arr']
  const indexUsed = isDefined(c)

  comp._parsedInfo._loopAttributes = {
    _itemArray: processPlaceholder(indexUsed ? c : b, true),
    _item: a,
    _itemIndex: indexUsed ? b : undefined,
    _key: processPlaceholder(/** @type {string}*/(getAttr(comp, _key)))
  }

  attributesToRemove.forEach(name => removeAttr(comp, name))
}
