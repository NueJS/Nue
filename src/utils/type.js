
/**
 * return true if the x is defined
 * @param {any} x
 * @returns {boolean}
 */
export const isDefined = x => x !== undefined

/**
  * return true if x is object
  * @param {any} x
  * @returns {boolean}
  */
export const isObject = x => typeof x === 'object' && x !== null
