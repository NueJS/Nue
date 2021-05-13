import { animationAttributes, loopAttributes } from '../../constants'
import { errors } from '../dev/errors/index.js'
import { getAnimationAttributes, getAttr, removeAttr } from '../node/dom'
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
 * @param {LoopedComp} loopedComp
 * @param {string} forAttribute
 * @param {string} parentCompName
 */

export const parseLoopedComp = (loopedComp, forAttribute, parentCompName) => {

  const [a, b, c] =
  forAttribute.replace(/\(|\)|,|(\sin\s)/g, ' ') // replace ' in ', '(', ')', ',' with space character
    .split(/\s+/) // split with space character,
    .filter(t => t) // remove empty strings

  // ['item', 'index', 'arr'] or
  // ['item', 'arr']
  const indexUsed = isDefined(c)
  const keyAttribute = getAttr(loopedComp, _key)

  if (_DEV_ && !keyAttribute) {
    throw errors.missing_key_attribute(loopedComp._compName, parentCompName)
  }

  loopedComp._parsedInfo._loopAttributes = {
    _itemArray: processPlaceholder(indexUsed ? c : b, true),
    _item: a,
    _itemIndex: indexUsed ? b : undefined,
    _key: processPlaceholder(/** @type {string}*/(keyAttribute))
  }

  loopedComp._parsedInfo._animationAttributes = getAnimationAttributes(loopedComp)

  attributesToRemove.forEach(name => removeAttr(loopedComp, name))
}
