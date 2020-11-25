import getRS from './getRS.js'

// state is created from this.props, fallback values are given in options.state

function addState () {
  const state = this.options.state || {}
  console.log('add state to', this.nodeName)
  if (this.props) {
    for (const prop in this.props) {
      const propValue = this.props[prop]
      if (propValue !== undefined) state[prop] = propValue
    }
  }

  this.state = getRS(state, this.onChange.bind(this))
}

export default addState
