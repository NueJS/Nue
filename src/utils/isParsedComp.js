/**
 * return true if the given node is a component using the parsed info
 * @param {Comp} target
 */
export const isParsedComp = target => (target)._parsedInfo && (target)._parsedInfo._isComp
