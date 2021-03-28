
/**
 * @param {Node} target
 */
export const isComp = target =>
  /** @type {ParsedDOMElement}*/(target)._parsedInfo &&
  /** @type {Comp}*/(target)._parsedInfo._isComp
