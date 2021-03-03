import getClone from '../../../node/clone'

// create a clone of loopedComp
// get the closure for this component using the value and index
const createComp = (blob, value, i) => {
  const { loopedComp, getClosure, compNode } = blob
  const newComp = getClone(loopedComp)
  newComp.loopClosure = getClosure(value, i)
  newComp.closure = compNode
  return newComp
}

export default createComp
