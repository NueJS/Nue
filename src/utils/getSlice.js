// state, a.b.c
// returns state.a.b.c

const getSlice = (obj, key) => {
  const arr = key.split('.')
  if (arr.length === 1) return obj[key]
  else {
    let value = obj
    for (let i = 0; i < arr.length; i++) {
      if (typeof value !== 'object') return undefined
      value = value[arr[i]]
    }

    return value
  }
}

export function findSlice (key, state, context) {
  let value
  let from = 0

  value = getSlice(state, key)
  if (value === undefined) {
    value = getSlice(context, key)
    if (value === undefined) from = -1
    else from = 1
  }

  return {
    from,
    value
  }
}

export default getSlice
