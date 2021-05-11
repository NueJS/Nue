import { lower, upper } from '../others'

/**
 * add dash at the end of string
 * @param {string} str
 * @returns {string}
 */
export const dashify = str => lower(str) + '-'

/**
 * returns the nodeName of given compFnName
 * @param {string} str
 */
export const nodeName = str => upper(str) + '-'

/**
 * replace component names in html with dashed names
 * @param {string} html
 * @param {Function[]} compFns
 * @returns {string}
 */
export const dashifyComponentNames = (html, compFns) =>
  compFns.reduce(
    (acc, compFn) => acc.replace(new RegExp(`<${compFn.name}|</${compFn.name}`, 'g'), dashify),
    html
  )
