import { hasSlice } from './state/slice'

const getFn = (comp, fnName) => {
  let target = comp
  while (!target.fn[fnName]) {
    if (target.closure) target = target.closure
    else return undefined
  }

  return target.fn[fnName]
}

// get the origin component where the value of the state is coming from
export const origin = (comp, path) => {
  let target = comp
  while (!hasSlice(target.$Target, path)) {
    if (!target.closure) return undefined
    target = target.closure
  }
  return target
}

export default getFn
