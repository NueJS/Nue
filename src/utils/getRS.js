const isObject = x => typeof x === 'object' && x !== null

let disableOnChange = false

function getRS (_state, onChange, chain = []) {
  const state = typeof _state === 'function' ? _state() : _state
  if (!isObject(state)) return state

  // make all children radioactive and save it in a wrapper
  const radioactiveWrapper = Array.isArray(state) ? [] : {}
  Object.keys(state).forEach(key => {
    radioactiveWrapper[key] = getRS(state[key], onChange, [...chain, key])
  })

  // make the wrapper radioactive
  return new Proxy(radioactiveWrapper, {
    set (target, prop, value) {
      if (disableOnChange) return Reflect.set(target, prop, value)
      return onChange([...chain, prop], value, 'set')
    },

    deleteProperty (target, prop) {
      if (disableOnChange) return Reflect.deleteProperty(target, prop)
      return onChange([...chain, prop], undefined, 'deleteProperty')
    },

    get (target, prop) {
      if (prop === '__isRadioactive__') return true
      if (prop === '__disableOnChange__') {
        return value => {
          disableOnChange = value
        }
      }

      return Reflect.get(target, prop)
    }
  })
}

export default getRS
