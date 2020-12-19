function getFn (comp, fnName) {
  let target = comp
  while (!target.fn[fnName]) {
    if (comp.sweet) {
      target = comp.sweet.closure.component
    }
    else return undefined
  }

  return target.fn[fnName]
}

export default getFn
