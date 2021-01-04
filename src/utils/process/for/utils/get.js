import { attr } from '../../../node/dom'
import { targetProp } from '../../../state/slice'

export const getStateProps = (forInfo, value, i) => {
  const stateProps = {
    [forInfo.each.content]: value
  }

  if (forInfo.at) stateProps[forInfo.at.content] = i
  return stateProps
}

export const getArray = (forInfo, comp) => forInfo.of.getValue(comp).__target__

export const getHashArray = (forInfo, arr) =>
  arr.map((value, i) => getHash(forInfo, getStateProps(forInfo, value, i)))

// @TODO - do not use deps[0] - it won't work with function
export const getHash = (forInfo, stateProps) => {
  const [target, prop] = targetProp(stateProps, forInfo.key.deps[0])
  return target[prop]
}

export const getForInfo = (forNode) => {
  const forInfo = {}
  for (const at of ['reorder', 'enter', 'exit', 'key']) {
    forInfo[at] = attr(forNode, at)
  }

  // build forInfo object
  forNode.sweet.attributes.forEach(attribute => {
    const { name, placeholder } = attribute
    forInfo[name] = placeholder
  })

  return forInfo
}
