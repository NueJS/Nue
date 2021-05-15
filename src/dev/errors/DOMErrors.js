import { createError } from '../createError'

/**
 * called when root element is not added in html
 * @param {string} elName
 * @returns {Error}
 */

export const root_not_found_in_html = (elName) => {
  const element = `<${elName}> </${elName}>`
  const issue = `Could not find ${element} in html to render ${elName}`
  const fix = `Add ${element} in HTML to render the ${elName}`
  return createError(issue, fix)
}
