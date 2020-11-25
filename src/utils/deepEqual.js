function deepEqual (x, y) {
  // type match
  if (typeof x !== typeof y) return false

  // value types
  if (typeof x !== 'object' || x === null) { return x === y }

  // array type match
  const xIsArr = Array.isArray(x)
  const yIsArr = Array.isArray(y)
  if (xIsArr !== yIsArr) return false

  if (xIsArr && yIsArr) {
    // array length match
    if (x.length !== y.length) return false
    // array value match
    for (let i = 0; i < x.length; i++) {
      if (!deepEqual(x[i], y[i])) return false
    }
    return true
  }

  // object
  if (typeof x === 'object') {
    const keysOfX = Object.keys(x)
    const keysOfY = Object.keys(y)
    // keys length match
    if (keysOfX.length !== keysOfY) return false
    // keys match
    if (!deepEqual(keysOfX, keysOfY)) return false

    // values match
    for (const key of keysOfX) {
      if (!deepEqual(x[key], y[key])) return false
    }

    return true
  }
}

export default deepEqual
