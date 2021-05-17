import { createError } from '../utils/createError'
import { toJSON } from '../utils/toJSON'
import { getCodeWithError } from '../utils/getCodeWithError'

/**
 * called when looped components are given non-unique key attribute
 * @param {string} compName
 * @param {string[]} keys
 * @returns {Error}
 */

export const keys_not_unique = (compName, keys) => {

  const nonUniqueKeys = keys.filter((key, i) => {
    return keys.indexOf(key, i) !== keys.lastIndexOf(key)
  })

  const _keys = keys.map(toJSON).join(', ')
  const nonUniqueKeysJoin = nonUniqueKeys.map(toJSON).join(', ')
  const _s = nonUniqueKeys.length > 1 ? 's' : ''

  const issue = `\
non-unique key${_s} used in <${compName}>

keys used: \n${_keys}

non-unique key${_s}: ${nonUniqueKeysJoin}`

  const fix = 'make sure that all keys are unique'

  console.log('keys: ', keys)
  console.log('non unique Keys: ', nonUniqueKeys)

  const code = getCodeWithError(compName, /\*key=/)

  // @TODO improve the regex
  return createError(issue, fix, code, compName)
}

// TODO: needs better regex
/**
 * called when a key attribute is not a placeholder on a looped component
 * @param {string} loopedCompName
 * @param {string} parentCompName
 * @returns {Error}
 */
export const hardcoded_keys = (loopedCompName, parentCompName) => {

  const issue = `"*key" attribute on <${loopedCompName}> in <${parentCompName}> is hard-coded`

  const fix = `\
make sure you are using a placeholder on "*key" attribute's value.

Example:

✔ *key='[foo]'
✖ *key='foo'`

  const code = getCodeWithError(parentCompName, /\*key=/)
  return createError(issue, fix, code, parentCompName)
}

/**
 * called when key attribute is not specified on looped component
 * @param {string} loopedCompName
 * @param {string} parentCompName
 * @returns {Error}
 */
export const missing_key_attribute = (loopedCompName, parentCompName) => {

  const issue = `"*key" attribute is missing on looped component <${loopedCompName}> in <${parentCompName}>, which is required for efficient DOM updates`

  const fix = `Add "*key" attribute on looped <${loopedCompName}> to fix this error`

  return createError(issue, fix, undefined, parentCompName)
}
