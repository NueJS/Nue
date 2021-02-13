const modes = {
  // when detection mode is true, all key accessed in state is recorded in keyAccesses array
  detective: false,

  // when reactive is true any mutation in state does not trigger addDep function
  reactive: false,

  // when noOverride is true, setting a key in state which already exists does nothing
  // this is used so that default value of state does not override the state set by the parent component
  // via state attribute
  noOverride: false
}

export default modes
