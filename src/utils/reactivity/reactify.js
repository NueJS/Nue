import onChange from '../state/onChange.js'
const isObject = x => typeof x === 'object' && x !== null
let disableOnChange = false

function reactify (_state, chain = []) {
  let state = _state

  // if state.key is a function
  // call it with initial value of state to set the initial value
  // update this value whenever the state changes
  if (typeof _state === 'function') {
    const key = chain.join('.')
    state = _state(this.compObj.state)
    this.compObj.state[key] = state
    const handleStateChange = () => {
      const newValue = _state(this.state)
      const currentValue = this.state[key]
      if (newValue !== currentValue) { this.state[key] = newValue }
    }

    this.computedStateDeps.push({
      notFor: key,
      callback: handleStateChange
    })
  }

  if (!isObject(state)) return state

  // make all children radioactive and save it in a wrapper
  const wrapper = Array.isArray(state) ? [] : {}
  Object.keys(state).forEach(key => {
    wrapper[key] = reactify.call(this, state[key], [...chain, key])
  })

  const _this = this

  // make the wrapper radioactive
  return new Proxy(wrapper, {

    set (target, prop, value) {
      let v = value
      if (isObject(value)) v = reactify.call(_this, value, [...chain, prop])
      if (disableOnChange) return Reflect.set(target, prop, v)
      return onChange.call(_this, [...chain, prop], v, 'set')
    },

    deleteProperty (target, prop) {
      if (disableOnChange) return Reflect.deleteProperty(target, prop)
      return onChange.call(_this, [...chain, prop], undefined, 'deleteProperty')
    },

    get (target, prop) {
      // if (prop === '__isRadioactive__') return true
      if (prop === '__disableOnChange__') {
        return value => {
          disableOnChange = value
        }
      }

      return Reflect.get(target, prop)
    }
  })
}

export default reactify
