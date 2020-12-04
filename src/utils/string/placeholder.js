// remove first and last character of the string
// '[lorem ipsum]' -> 'lorem ipsum'
export const unwrap = str => str.substr(1, str.length - 2)

// return true if the string is wrapped in brackets
// '[xyz]' -> true
export const is_placeholder = str => str[0] === '[' && str[str.length - 1] === ']'
