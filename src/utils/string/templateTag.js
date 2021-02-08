const templateTag = (strings, ...exprs) => {
  let str = ''
  for (let i = 0; i < strings.length; i++) {
    const value = exprs[i]
    str += strings[i]
    if (value) str += value
  }

  return str
}

export default templateTag
