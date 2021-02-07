
export const unBracket = str => str.slice(1, -1)

export const bracketify = str => '[' + str + ']'

export const isBracketed = str => str.startsWith('[') && str.endsWith(']')
