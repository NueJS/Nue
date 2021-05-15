/**
 * returns newly created element of given tag name
 * @param {string} tagName
 * @returns {Element}
 */
export const createElement = (tagName) => document.createElement(tagName)

/**
 * returns a comment node with given text
 * @param {string} data
 * @returns {Comment}
 */
export const createComment = (data) => document.createComment(data)
