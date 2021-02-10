// import globalInfo from '../../../globalInfo'
import { getOffset } from '../../../node/dom'
import { getStateProps } from './get'

const createComp = (comp, name, forInfo, value, i) => {
  const newComp = document.createElement(name)
  // // apply class
  // if (forInfo.class) newComp.className = forInfo.class
  newComp.sweet = {
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

// export const registerComp = (name, tempString) => {
//   globalInfo.components[name] = o => o.template(tempString)
// }

export default createComp
