import * as attributeErrors from './attributeErrors'
import * as hookErrors from './hookErrors'
import * as loopedCompErrors from './loopedCompErrors'
import * as placeholderErrors from './placeholderErrors'

export const errors = {
  ...attributeErrors,
  ...hookErrors,
  ...loopedCompErrors,
  ...placeholderErrors
}
