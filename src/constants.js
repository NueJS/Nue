// reserved attribute names

export const conditionAttributes = {
  _if: '*if',
  _else: '*else',
  _elseIf: '*else-if'
}

export const loopAttributes = {
  _for: '*for',
  _key: '*key'
}

export const animationAttributes = {
  _enter: '*enter',
  _exit: '*exit',
  _move: '*move'
}

export const otherAttributes = {
  _ref: '*ref'
}

// symbols
export const TARGET = /*#__PURE__*/ Symbol()
export const UPDATE_INDEX = /*#__PURE__*/ Symbol()
export const IS_REACTIVE = /*#__PURE__*/ Symbol()
export const ITSELF = /*#__PURE__*/ Symbol()
