import * as attributeErrors from './attributeErrors'
import * as eventErrors from './eventErrors'
import * as loopedCompErrors from './loopedCompErrors'
import * as placeholderErrors from './placeholderErrors'
import * as DOMErrors from './DOMErrors'

export const errors = {
  ...attributeErrors,
  ...eventErrors,
  ...loopedCompErrors,
  ...placeholderErrors,
  ...DOMErrors
}
