import copyParsed from '../../../node/copyParsed'
import { getStateProps } from './get'

// create a clone of component with for attribute - forNode
// add the given item and index as the stateProps
const createComp = (comp, name, forNode, forInfo, value, i) => {
  // clone forNode
  const newComp = forNode.cloneNode(true)
  copyParsed(forNode, newComp)

  // add the loop's value and index as stateProps
  newComp.parsed.stateProps = getStateProps(forInfo, value, i)

  return newComp
}

export default createComp
