// get the slice at given path in given obj
// for example: slice(obj, ['a', 'b', 'c']) returns obj.a.b.c

const slice = (obj, path) => {
  if (path.length === 1) return obj[path[0]]
  let value = obj
  path.forEach(p => { value = value[p] })
  return value
}

export const hasSlice = (obj, path) => {
  let target = obj

  for (const p of path) {
    if (target[p] === undefined) return false
    target = target[p]
  }

  return target !== undefined
}

export default slice
