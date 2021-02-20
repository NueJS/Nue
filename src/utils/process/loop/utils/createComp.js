import copyParsed from '../../../node/copyParsed'

// create a clone of loopedComp
// get the closure for this component using the value and index
const createComp = (blob, value, i) => {
  const { loopedComp, getClosure } = blob
  const newComp = loopedComp.cloneNode(true)
  copyParsed(loopedComp, newComp)
  newComp.parsed.loopClosure = getClosure(value, i)
  return newComp
}

export default createComp
