import data from 'utils/data'

/**
 * call this function to show that given node is updated
 * @param {import('types/dom').ParsedDOMElement} node
 */
const nodeUpdated = (node) => {
  if (data._onNodeUpdate) data._onNodeUpdate(node)
}

export default nodeUpdated
