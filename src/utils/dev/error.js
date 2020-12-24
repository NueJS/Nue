import handleErrors from './handleErrors.js'

function err (obj) {
  const error = new Error(obj.message)
  error.sweet = {
    code: obj.code,
    link: obj.link,
    comp: this
  }

  handleErrors(error)
  return error
}

export default err
