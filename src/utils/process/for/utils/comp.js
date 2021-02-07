import globalInfo from '../../../globalInfo'
import { getOffset } from '../../../node/dom'
import { getStateProps } from './get'

const createComp = (name, forInfo, value, i) => {
  const newComp = document.createElement(name)
  // // apply class
  // if (forInfo.class) newComp.className = forInfo.class
  newComp.stateProps = getStateProps(forInfo, value, i)
  // record the initial offset
  if (forInfo.reorder) {
    requestAnimationFrame(() => {
      newComp.prev = getOffset(newComp)
    })
  }
  return newComp
}

export const registerComp = (name, tempString) => {
  globalInfo.components[name] = o => o.template(tempString)
}

export default createComp
