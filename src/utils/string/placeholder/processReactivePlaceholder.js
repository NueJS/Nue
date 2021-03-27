
import { placeholderTypes } from '../../../enums'
import { errors } from '../../dev/errors.js'
import { isDefined } from '../../others.js'
import { targetProp } from '../../state/slice.js'

/**
 * process reactive placeholder
 * @param {string} _content
 * @returns {Placeholder}
 */

export const processReactivePlaceholder = (_content) => {
  const statePath = _content.split('.')

  /**
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
        throw errors.STATE_NOT_FOUND(comp._compFnName, _content)
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
    _stateDeps: [statePath],
    _content
  }
}
