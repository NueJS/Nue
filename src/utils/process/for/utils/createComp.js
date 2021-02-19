import copyParsed from '../../../node/copyParsed'
import { getClosure } from './get'

// create a clone of loopedComp
// get the closure for this component using the value and index
const createComp = (blob, value, i) => {
  const { loopedComp } = blob
  const newComp = loopedComp.cloneNode(true)
  copyParsed(loopedComp, newComp)
  newComp.parsed.loopClosure = getClosure(blob, value, i)
  return newComp
}

export default createComp
