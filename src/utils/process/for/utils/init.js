import createComp from './comp'
import { getNewState } from './state'
import deepClone from '../../../deepClone'

const init = ({ forInfo, comp, comps, forNode, compName, oldState }) => {
  const state = getNewState(forInfo, comp)

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
