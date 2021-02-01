
export const unBracket = str => str.substr(2, str.length - 4)

export const bracketify = str => '{{' + str + '}}'

export const isBracketed = str => str.startsWith('{{') && str.endsWith('}}')
