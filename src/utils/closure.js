import { hasSlice } from './state/slice'

// get the origin component where the value of the state is coming from
export const origin = (nue, path) => {
  let target = nue
  while (!hasSlice(target.$Target, path)) {
    if (!target.closure) return undefined
    target = target.closure
  }
  return target
}
