/**
 * remove first and last character
 * @param {string} str
 * @returns {string}
 */
export const unBracket = str => str.slice(1, -1)

/**
 * check if the string has brackets at the ends
 * @param {string} str
 * @returns {boolean}
 */
export const isBracketed = str => str[0] === '[' && str.endsWith(']')
