
import { placeholderTypes } from '../../../enums'
import { data } from '../../data'
import { errors } from '../../dev/errors'
import { isDefined } from '../../others.js'
import { targetProp } from '../../state/slice.js'

/**
 * process reactive placeholder
 * @param {string} _content
 * @param {string} _text
 * @returns {Placeholder}
 */

export const processReactivePlaceholder = (_content, _text) => {
  const statePath = _content.split('.')

  /**
   * return the value of state placeholder in context of given component
   * @param {Comp} comp
   */
  const _getValue = (comp) => {
    if (_DEV_) {
      try {
        const [target, prop] = targetProp(comp.$, statePath)
        const value = target[prop]
        if (!isDefined(value)) throw value
        else return value
      } catch (e) {
        if (!data._errorThrown) throw errors.invalid_state_placeholder(comp, _content)
      }
    }

    // prod
    else {
      const [target, prop] = targetProp(comp.$, statePath)
      return target[prop]
    }
  }

  return {
    _type: placeholderTypes._reactive,
    _getValue,
    _statePaths: [statePath],
    _content,
    _text
  }
}
