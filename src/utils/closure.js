function getFn (comp, fnName) {
  let target = comp
  while (!target.fn[fnName]) {
    if (target.closure) target = target.closure
    else return undefined
  }

  return target.fn[fnName]
}

export default getFn
