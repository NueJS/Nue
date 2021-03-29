import { createError } from '../createError'
import { compName } from '../name'

/**
 * convert to json
 * @param {any} v
 * @returns {string}
 */
const toJSON = v => JSON.stringify(v)

/**
   * @param {Comp} comp
   * @param {string[]} keys
   * @returns {Error}
   */

export const keys_not_unique = (comp, keys) => {

  const nonUniqueKeys = keys.filter((key, i) => {
    return keys.indexOf(key, i) !== keys.lastIndexOf(key)
  })

  const _keys = keys.map(toJSON).join(', ')
  const nonUniqueKeysJoin = nonUniqueKeys.map(toJSON).join(', ')
  const _s = nonUniqueKeys.length > 1 ? 's' : ''

  const issue = `\
non-unique key${_s} used in ${compName(comp)}

keys used: \n${_keys}

non-unique key${_s}: ${nonUniqueKeysJoin}`

  const fix = 'make sure that all keys are unique'

  console.log('keys: ', keys)
  console.log('non unique Keys: ', nonUniqueKeys)

  const type = 'keys_not_unique'

  return createError(type, issue, fix, comp)
}

/**
 * @param {Comp} comp
 * @param {Comp} parentComp
 * @returns {Error}
 */
export const hardcoded_keys = (comp, parentComp) => {

  const issue = `"*key" attribute on ${compName(comp)} in ${compName(parentComp)} is hard-coded`

  const fix = `\
make sure you are using a placeholder on "*key" attribute's value.

Example:

✔ *key='[foo]'
✖ *key='foo'`

  const type = 'hardcoded_keys'
  return createError(type, issue, fix, comp)
}

/**
 * @param {Comp} comp
 * @param {Comp} parentComp
 * @returns {Error}
 */
export const missing_key_attribute = (comp, parentComp) => {

  const issue = `"*key" attribute is missing on ${compName(comp)} in ${compName(parentComp)}`

  const fix = '*key attribute is required on a looped component for efficient and correct updates'

  const type = 'missing_key_attribute'
  return createError(type, issue, fix, comp)
}

/**
 * @param {Comp} comp
 * @param {Comp} parentComp
 * @returns {Error}
 */
export const invalid_for_attribute = (comp, parentComp) => {

  const issue = `Invalid for attribute value on ${compName(comp)} in ${compName(parentComp)}`

  const fix = `\
make sure you are following this pattern:
*for='(item, index) in items'
or
*for='item in items'`

  const type = 'invalid_for_attribute'
  return createError(type, issue, fix, comp)
}
