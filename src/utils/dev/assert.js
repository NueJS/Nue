import errors from './errors'

// this should be called once
const callOnlyOnce = (fn) => {
  if (fn.calledOnce) {
    errors.FN_CALLED_MORE_THAN_ONCE(fn.name)
  } else {
    fn.calledOnce = true
  }
}

export default callOnlyOnce
