// import DEV from './DEV.js'
import handleErrors from './handleErrors.js'

function err (obj) {
  handleErrors(obj)
  throw new Error(obj.message)
}

export default err
