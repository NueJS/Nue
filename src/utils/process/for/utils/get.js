import { targetProp } from '../../../state/slice'

export const getStateProps = (forInfo, value, i) => {
  const { as, at } = forInfo
  return {
    [as]: value,
    [at]: i
  }
}

export const getHashArray = (forInfo, arr) =>
  arr.map((value, i) => getHash(forInfo, getStateProps(forInfo, value, i)))

// @TODO - do not use deps[0] - it won't work with function
export const getHash = (forInfo, stateProps) => {
  const [target, prop] = targetProp(stateProps, forInfo.key.deps[0])
  return target[prop]
}
