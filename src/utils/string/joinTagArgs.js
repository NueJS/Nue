/**
 * join strings and expressions
 * @param {string[]} strings
 * @param  {string[]} exprs
 * @returns
 */
export const joinTagArgs = (strings, exprs) => exprs.reduce(
  (acc, expr, i) => acc + strings[i] + expr, '') + strings[strings.length - 1]
