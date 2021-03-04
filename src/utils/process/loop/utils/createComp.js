import getClone from '../../../node/clone'

// create a clone of loopedComp
// get the closure for this component using the value and index
const createComp = (blob, value, i) => {
  const { loopedComp, compNode, at, as } = blob
  const newComp = getClone(loopedComp)
  newComp.closure = compNode

  newComp.init$ = {
    [at]: i,
    [as]: value
  }

  return newComp
}

export default createComp
