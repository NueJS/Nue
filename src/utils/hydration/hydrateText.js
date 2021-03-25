import { syncNode } from '../subscription/node'

/**
 * process the text node
 * @param {import('types/dom').Parsed_Text} textNode
 * @param {import('types/dom').Comp} comp
 */
export const hydrateText = (textNode, comp) => {
  const parsed = textNode._parsedInfo
  const { _getValue, _stateDeps } = parsed._placeholder
  const update = () => {
    textNode.textContent = _getValue(comp)
  }
  syncNode(comp, textNode, _stateDeps, update)
}
