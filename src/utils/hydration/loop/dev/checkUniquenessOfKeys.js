import { errors } from '../../../dev/errors/index.js'

/**
 * DEV ONLY: check if all the keys are unique, else throw error
 * @param {string[]} keys
 * @param {Comp} comp
 */
export const checkUniquenessOfKeys = (keys, comp) => {
  if (new Set(keys).size !== keys.length) {
    throw errors.keys_not_unique(comp, keys)
  }
}
