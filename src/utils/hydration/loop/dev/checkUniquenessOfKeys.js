import { errors } from '../../../dev/errors'

/**
 * DEV ONLY: check if all the keys are unique, else throw error
 * @param {string[]} keys
 * @param {Comp} comp
 */
export const checkUniquenessOfKeys = (keys, comp) => {
  if (new Set(keys).size !== keys.length) {
    throw errors.KEYS_ARE_NOT_UNIQUE(comp._compFnName, keys)
  }
}
