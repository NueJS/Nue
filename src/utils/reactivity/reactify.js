import on_state_mutation from '../slice/on_state_mutation.js'
import modes from './modes.js'
import functional_slices from '../slice/functional_slice.js'
import { accessed } from '../slice/slices_used.js'

const isObject = x => typeof x === 'object' && x !== null

// create a reactive object which when mutated calls the on_change function
function reactify (state, path = []) {
  if (!isObject(state)) return state

  const wrapper = Array.isArray(state) ? [] : {}
  Object.keys(state).forEach(key => {
    wrapper[key] = reactify.call(this, state[key], [...path, key])
  })

  const _this = this
  return new Proxy(wrapper, {
    set (target, prop, newValue) {
      if (modes.no_overrides && target[prop]) return true
      //
      let value = newValue
      if (typeof value === 'function') value = functional_slices.call(_this, value, prop)
      else if (isObject(value)) value = reactify.call(_this, value, [...path, prop])
      //
      const old = target[prop]
      // // console.log('old is ', old)
      const success = Reflect.set(target, prop, value)
      if (modes.reactive) {
        if (!(prop === 'length' && Array.isArray(target))) {
          on_state_mutation.call(_this, [...path, prop], old)
        }
      }
      return success
    },

    deleteProperty (target, prop) {
      if (modes.reactive) {
        on_state_mutation.call(_this, [...path, prop])
      }
      return Reflect.deleteProperty(target, prop)
    },

    get (target, prop) {
      if (modes.detect_slices) {
        if (path.length !== 0) accessed.paths[accessed.paths.length - 1] = [...path, prop]
        else accessed.paths.push([...path, prop])
      }

      // else if (prop === '__isRadioactive__') return true
      return Reflect.get(target, prop)
    }

  })
}

export default reactify
