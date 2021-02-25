const deepClone = (x) => {
  // value
  if (typeof x !== 'object' || x === null) return x

  // array
  if (Array.isArray(x)) {
    return x.map(v => deepClone(v))
  }

  // object
  if (typeof x === 'object') {
    const clone = {}
    for (const key in x) {
      clone[key] = deepClone(x[key])
    }
    return clone
  }
}

export default deepClone
