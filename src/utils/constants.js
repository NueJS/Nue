// Internal API constants are integers for better minification
// public API constants are strings
// public API that are only meant to be used by internal API constants are symbols

// attribute types
export const NORMAL = 10
export const EVENT = 11
export const STATE = 12
export const BIND = 13
export const CONDITIONAL = 14
export const STATIC_STATE = 15
export const FUNCTION_ATTRIBUTE = 16
export const REF = 17

// placeholder types
export const REACTIVE = 30
export const FN = 31
export const TEXT = 32

// reactify modes
export const DETECTIVE_MODE = 40
export const REACTIVE_MODE = 41
export const NO_OVERRIDE_MODE = 42

// batch names
export const BEFORE_DOM_BATCH = 31
export const DOM_BATCH = 32

// reserved attribute names
export const IF_ATTRIBUTE = '*if'
export const ELSE_IF_ATTRIBUTE = '*else-if'
export const ELSE_ATTRIBUTE = '*else'
export const FOR_ATTRIBUTE = '*for'
export const KEY_ATTRIBUTE = '*key'
export const REF_ATTRIBUTE = '*ref'
export const ENTER_ANIMATION = '*enter'
export const EXIT_ANIMATION = '*exit'
export const REORDER_TRANSITION = '*reorder'

// symbols
export const TARGET = /*#__PURE__*/ Symbol()
export const UPDATE_INDEX = /*#__PURE__*/ Symbol()
export const IS_REACTIVE = /*#__PURE__*/ Symbol()

// reconcile step types
export const SWAP = 50
export const CREATE = 51
export const REMOVE = 52

// lifecycle cbs
export const ON_MOUNT_CBS = 60
export const ON_DESTROY_CBS = 61
export const BEFORE_UPDATE_CBS = 62
export const AFTER_UPDATE_CBS = 63
export const ON_MUTATE_CBS = 64

// compNode internal only properties
export const BATCH_INFO = /*#__PURE__*/ Symbol()
export const IS_BATCHING = /*#__PURE__*/ Symbol()
export const IGNORE_DISCONNECT = /*#__PURE__*/ Symbol()
export const DEFERRED_WORK = /*#__PURE__*/ Symbol()
export const PARSED = /*#__PURE__*/ Symbol()
