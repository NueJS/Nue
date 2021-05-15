import { createError } from '../utils/createError'
import { toJSON } from '../utils/toJSON'
import { getCodeWithError } from '../utils/code'

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

  const issue = `"*key" attribute is missing on looped component <${loopedCompName}> in <${parentCompName}>`

  const fix = '*key attribute is required on a looped component for efficient and correct updates'

  const code = getCodeWithError(loopedCompName, new RegExp(`<${loopedCompName}`))

  return createError(issue, fix, code, parentCompName)
}

/**
 * called when looping attribute *for is given invalid value
 * @param {Comp} comp
 * @param {Comp} compDef
 * @returns {Error}
 */
// export const invalid_for_attribute = (comp, compDef) => {

//   const issue = `Invalid for attribute value on ${angularCompName(comp)} in ${angularCompName(compDef)}`

//   const fix = `\
// make sure you are following this pattern:
// *for='(item, index) in items'
// or
// *for='item in items'`

//   const errorCode = getCodeWithError(compDef, /\*for=/)

//   return createError(issue, fix, comp, errorCode, invalid_for_attribute.name)
// }
