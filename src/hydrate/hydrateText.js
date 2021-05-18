import { syncNode } from '../subscription/node/syncNode'

/**
 * process the text node
 * @param {Parsed_Text} textNode
 * @param {Comp} comp
 */
export const hydrateText = (textNode, comp) => {
  const parsed = textNode._parsedInfo
  const { _getValue, _statePaths } = parsed._placeholder
  const update = () => {
    textNode.textContent = _getValue(comp)
  }
  syncNode(textNode, _statePaths, update, comp)
}
