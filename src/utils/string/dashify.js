import { lower } from '../others'

/**
 * add dash at the end of string
 * @param {string} str
 * @returns {string}
 */
export const dashify = str => lower(str) + '-'

/**
 * replace component names in html with dashed names
 * @param {string} html
 * @param {Function[]} components
 * @returns {string}
 */
export const dashifyComponentNames = (html, components) =>
  components.reduce(
    (acc, comp) => acc.replace(new RegExp(`<${comp.name}|</${comp.name}`, 'g'), dashify),
    html
  )
