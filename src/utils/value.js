// "a.b.c" -> returns this.a.b.c
export function getSlice (chain) {
  if (chain.length === 1) return this[chain[0]]
  else {
    let value = this
    for (let i = 0; i < chain.length; i++) {
      if (typeof value !== 'object') throw new Error(`invalid variable used: ${chain.join('.')} in ${this}`)
      value = value[chain[i]]
    }

    return value
  }
}

// "state.a.b.c" returns this.state.a.b.c
// a.b.c returns context.a.b.c
function getValue (chain, context) {
  const isStateKey = chain[0] === 'state'
  const _this = isStateKey ? this : context
  return [getSlice.call(_this, chain), isStateKey]
}

export default getValue
