/**
 * return true if the given node is a component using the parsed info
 * @param {Node} target
 */
export const isComp = target =>
  /** @type {ParsedDOMElement}*/(target)._parsedInfo &&
  /** @type {Comp}*/(target)._parsedInfo._isComp
