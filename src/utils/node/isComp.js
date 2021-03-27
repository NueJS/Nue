
/**
 * @param {ParsedDOMElement} target
 */
export const isComp = target =>
  target._parsedInfo &&
  // @ts-expect-error
  target._parsedInfo._isComp
