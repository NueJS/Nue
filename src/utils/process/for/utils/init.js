import createComp from './comp'
import { getNewState } from './state'
import deepClone from '../../../deepClone'

// initialize for loop
const init = ({ forInfo, comp, comps, forNode, name, oldState }) => {
  const state = getNewState(forInfo, comp)

  // create and add component to DOM by going over array
  state.value.forEach((value, index) => {
    const newComp = createComp(comp, name, forInfo, value, index)
    comps.push(newComp)
    forNode.before(newComp)
  })

  oldState.hash = state.hash
  oldState.value = deepClone(state.value)
}

export default init
