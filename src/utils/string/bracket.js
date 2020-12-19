
export const unBracket = str => str.substr(1, str.length - 2)

export const bracketify = str => `[${str}]`

export const isBracketed = str => str[0] === '[' && str[str.length - 1] === ']'
