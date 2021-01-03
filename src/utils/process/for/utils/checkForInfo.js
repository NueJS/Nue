import err from '../../../dev/error.js'

const checkForInfo = ({ forInfo }) => {
  if (!forInfo.each) {
    err({
      message: 'for loop is missing "each" attribute',
      code: 1,
      link: ''
    })
  }

  if (!forInfo.of) {
    err({
      message: 'for loop is missing "of" attribute',
      code: 2,
      link: ''
    })
  }

  if (!forInfo.key) {
    err({
      message: 'for loop is missing "key" attribute',
      code: 2,
      link: ''
    })
  }
}

export default checkForInfo
