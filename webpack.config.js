const path = require('path')
const webpack = require('webpack')

module.exports = ({ mode }) => ({
  mode,
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'supersweet.js',
    globalObject: 'this',
    library: 'supersweet'
  },
  plugins: [
    // globals
    new webpack.DefinePlugin({
      DEV: JSON.stringify(mode === 'development')
    })
  ]
})
