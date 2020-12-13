import on_state_mutation from '../slice/onMutate.js'
import modes from './modes.js'
import computedState from '../slice/computedState.js'
import { accessed } from '../slice/detectStateUsage.js'

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
      let value = newValue
      if (modes.noOverride) {
        if (target[prop]) return true
        if (typeof value === 'function') value = computedState.call(_this, value, prop)
      }

      if (isObject(value)) value = reactify.call(_this, value, [...path, prop])

      let success
      if (modes.reactive) {
        if (!(prop === 'length' && Array.isArray(target))) {
          if (target[prop] !== value) {
            success = Reflect.set(target, prop, value)
            on_state_mutation.call(_this, [...path, prop])
          }
        }
      }

      return success || Reflect.set(target, prop, value)
    },

    deleteProperty (target, prop) {
      if (modes.reactive) {
        on_state_mutation.call(_this, [...path, prop])
      }
      return Reflect.deleteProperty(target, prop)
    },

    get (target, prop) {
      if (modes.detective) {
        if (path.length !== 0) accessed.paths[accessed.paths.length - 1] = [...path, prop]
        else accessed.paths.push([...path, prop])
      }

      return Reflect.get(target, prop)
    }

  })
}

export default reactify
