import { getOffset } from '../../../node/dom'
import { getStateProps } from './get'

const createComp = (comp, name, forInfo, value, i) => {
  const newComp = document.createElement(name)

  newComp.parsed = {
    isComp: true,
    closure: comp,
    stateProps: getStateProps(forInfo, value, i)
  }

  // record the initial offset
  if (forInfo.reorder) {
    requestAnimationFrame(() => {
      newComp.prev = getOffset(newComp)
    })
  }
  return newComp
}

export default createComp
