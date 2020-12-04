import add_slice_dependency from '../slice/add_slice_dependency.js'
import modes from './modes.js'
import functional_slices from '../slice/functional_slice.js'
import { accessed } from '../slice/slices_used.js'

const isObject = x => typeof x === 'object' && x !== null

// create a reactive object which when mutated calls the on_change function
function reactify (state, chain = []) {
  if (!isObject(state)) return state

  const wrapper = Array.isArray(state) ? [] : {}
  Object.keys(state).forEach(key => {
    wrapper[key] = reactify.call(this, state[key], [...chain, key])
  })

  const _this = this
  const $ = new Proxy(wrapper, {
    set (target, prop, newValue) {
      if (modes.no_overrides && target[prop]) return true
      let value = newValue
      if (typeof value === 'function') value = functional_slices.call(_this, value, prop)
      else if (isObject(value)) value = reactify.call(_this, value, [...chain, prop])
      if (modes.reactive) return Reflect.set(target, prop, value)
      else return add_slice_dependency.call(_this, [...chain, prop], value, 'set')
    },

    deleteProperty (target, prop) {
      if (modes.reactive) return Reflect.deleteProperty(target, prop)
      else return add_slice_dependency.call(_this, [...chain, prop], undefined, 'deleteProperty')
    },

    get (target, prop) {
      if (modes.detect_slices) {
        if (chain.length !== 0) accessed.paths[accessed.paths.length - 1] = [...chain, prop]
        else accessed.paths.push([...chain, prop])
      }

      // else if (prop === '__isRadioactive__') return true
      return Reflect.get(target, prop)
    }

  })

  return $
}

export default reactify
