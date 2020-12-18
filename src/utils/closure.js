function findFN (comp, fnName) {
  let target = comp
  while (!target.fn[fnName]) {
    if (comp.parentNode) {
      target = comp.parentNode.host
    }
    else return undefined
  }

  return target.fn[fnName]
}

export default findFN
