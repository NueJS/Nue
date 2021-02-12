import { getOffset } from '../../../node/dom'
import processAttributes from '../../attributes/processAttributes'
import processNode from '../../processNode'
import { getStateProps } from './get'

const createComp = (comp, name, forNode, forInfo, value, i) => {
  const newComp = forNode.cloneNode(true)
  // console.log('cloned : ', newComp)
  // const { as, at } = forInfo
  newComp.parsed = {
    isComp: true,
    closure: comp,
    stateProps: getStateProps(forInfo, value, i),
    attributes: forNode.parsed.attributes
  }

  // processAttributes(newComp)

  // record the initial offset
  if (forInfo.reorder) {
    requestAnimationFrame(() => {
      newComp.prev = getOffset(newComp)
    })
  }
  return newComp
}

export default createComp
