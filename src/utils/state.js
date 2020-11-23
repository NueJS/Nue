import getRS from './getRS.js'

// populate initial state with options.state
// override them with this.props
// create this.state by making the initstate object reactive

function addState () {
  const state = this.options.state
  if (this.props) {
    for (const prop in this.props) {
      const propValue = this.props[prop]
      if (propValue !== undefined) state[prop] = propValue
    }
  }

  this.state = getRS(state, this.onChange.bind(this))
}

export default addState
