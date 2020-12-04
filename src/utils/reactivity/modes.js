const modes = {
  // when detection mode is true, all key accessed in state is recorded in keyAccesses array
  detect_slices: false,

  // when reactive is true any mutation in state does not trigger add_slice_dependency function
  reactive: false,

  // when no_overrides is true, setting a key in state which already exists does nothing
  // this is used so that default value of state does not override the value in props
  no_overrides: false
}

export default modes
