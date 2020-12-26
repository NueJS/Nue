// import DEV from './DEV.js'
import handleErrors from './handleErrors.js'

function err (obj) {
  const error = new Error(obj.message)
  error.sweet = obj
  handleErrors(error)
  return error
}

export default err
