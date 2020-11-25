// "a.b.c" -> returns this.a.b.c
export function getSlice (key) {
  const arr = key.split('.')
  if (arr.length === 1) return this[key]
  else {
    let value = this
    for (let i = 0; i < arr.length; i++) {
      if (typeof value !== 'object') throw new Error(`invalid variable used: ${key} in ${this}`)
      value = value[arr[i]]
    }

    return value
  }
}

// "state.a.b.c" returns this.state.a.b.c
// a.b.c returns context.a.b.c
function getValue (key, context) {
  const keySplit = key.split('.')
  const isStateKey = keySplit[0] === 'state'
  const _this = isStateKey ? this : context
  return [getSlice.call(_this, key), isStateKey]
}

export default getValue
