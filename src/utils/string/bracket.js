// remove first and last character
export const unBracket = str => str.slice(1, -1)

// check if the string has brackets at the ends
export const isBracketed = str => str[0] === '[' && str.endsWith(']')
