export const targetProp = (obj, path) => {
  const target = path.slice(0, -1).reduce((target, key) => target[key], obj)
  const prop = path[path.length - 1]
  return [target, prop]
}

export const hasSlice = (obj, path) => {
  let target = obj

  for (const p of path) {
    if (target[p] === undefined) return false
    target = target[p]
  }

  return target !== undefined
}
