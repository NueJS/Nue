if (process.env.NODE_ENV !== 'development') {
  module.exports = require('./nue.cjs.prod.js')
} else {
  module.exports = require('./nue.cjs.dev.js')
}
