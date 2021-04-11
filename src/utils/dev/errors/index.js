import * as attributeErrors from './attributeErrors'
import * as hookErrors from './hookErrors'
import * as loopedCompErrors from './loopedCompErrors'
import * as placeholderErrors from './placeholderErrors'
import * as otherErrors from './otherErrors'

export const errors = {
  ...attributeErrors,
  ...hookErrors,
  ...loopedCompErrors,
  ...placeholderErrors,
  ...otherErrors
}
