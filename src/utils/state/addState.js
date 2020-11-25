import reactify from '../reactivity/reactify.js'

// state is created from this.props
// fallback values are given in compObj.state

function addState () {
  const state = this.compObj.state || {}
  if (this.props) {
    for (const prop in this.props) {
      state[prop] = this.props[prop]
    }
  }

  this.state = reactify.call(this, state)
}

export default addState
