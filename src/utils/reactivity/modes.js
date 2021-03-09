import { DETECTIVE_MODE, NO_OVERRIDE_MODE, REACTIVE_MODE, ORIGIN_MODE } from '../constants'

const modes = {
  // when detection mode is true, all key accessed in state is recorded in keyAccesses array
  [DETECTIVE_MODE]: false,

  // when reactive is true any mutation in state does not trigger subscribe function
  [REACTIVE_MODE]: false,

  // when noOverride is true, setting a key in state which already exists does nothing
  // this is used so that default value of state does not override the state set by the parent component
  // via state attribute
  [NO_OVERRIDE_MODE]: false,
  // when origin mode is true, get returns the compNode where the piece of state is coming from rather it's value
  [ORIGIN_MODE]: false
}

export default modes
