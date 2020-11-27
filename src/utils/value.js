// "a.b.c" -> returns this.a.b.c
function getSlice (obj, chain) {
  if (chain.length === 1) return obj[chain[0]]
  else {
    let value = obj
    for (let i = 0; i < chain.length; i++) {
      if (typeof value !== 'object') throw new Error(`invalid variable used: ${chain.join('.')} in ${this}`)
      value = value[chain[i]]
    }

    return value
  }
}

export default getSlice
