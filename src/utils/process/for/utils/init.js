import createComp from './comp'
import { getNewState } from './state'
import deepClone from '../../../deepClone'

const init = (blob) => {
  const { forInfo, comp, comps, forNode, compName, oldState } = blob
  const state = getNewState(forInfo, comp)

  // create and add component to DOM by going over array
  state.value.forEach((v, i) => {
    // debugger
    const newComp = createComp(compName, forInfo, v, i)
    comps.push(newComp)
    forNode.before(newComp)
  })

  oldState.hash = state.hash
  oldState.value = deepClone(state.value)
}

export default init
