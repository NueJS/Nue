import createComp from './comp'
import { getNewState } from './state'
import deepClone from '../../../deepClone'
import checkUniquenessOfKeys from '../dev/checkUniquenessOfKeys'
import DEV from '../../../dev/DEV'

const init = ({ forInfo, comp, comps, forNode, compName, oldState }) => {
  const state = getNewState(forInfo, comp)

  if (DEV) {
    checkUniquenessOfKeys(comp, state.hash)
  }

  // create and add component to DOM by going over array
  state.value.forEach((value, index) => {
    // debugger
    const newComp = createComp(compName, forInfo, value, index)
    comps.push(newComp)
    forNode.before(newComp)
  })

  oldState.hash = state.hash
  oldState.value = deepClone(state.value)
}

export default init
