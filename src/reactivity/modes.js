export const modes = {
  /** when detection mode is true,
   * all key accessed in state is recorded in an array called "keyAccesses"
   */
  _detective: false,

  /** when reactive is true
   * state mutation does not invoke onMutate function
   */
  _reactive: false,

  /** when setup mode is active,
   * setting a key in state which already exists does nothing
   * this is used so that default value of state does not override the state set by the parent component
   * via state attribute
   */
  _setup: false,

  /** when origin mode is true,
   * it returns the comp where the piece of state is coming from rather it's value
   */
  _returnComp: false
}
