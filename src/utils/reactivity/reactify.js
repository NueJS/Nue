import onMutate from '../state/onMutate.js'
import modes from './modes.js'
import computedState from '../state/computedState.js'
import { accessed } from '../state/detectStateUsage.js'
import deepEqual from '../deepEqual.js'

const isObject = x => typeof x === 'object' && x !== null

// create a reactive object which when mutated calls the on_change function
function reactify (state, path = [], proto) {
  if (!isObject(state)) return state

  // const wrapper = Object.create(proto)
  const wrapper = Array.isArray(state) ? [] : {}
  Object.keys(state).forEach(key => {
    wrapper[key] = reactify.call(this, state[key], [...path, key])
  })

  const _this = this
  return new Proxy(wrapper, {
    set (target, prop, newValue) {
      // if the prop is not available in target
      // try and find it in parent
      // if found in parent return it
      // else set it in this state
      if (!(prop in target) && !modes.noOverride) {
        // console.log('prop', prop, 'not in', target)
        if (proto) {
          const status = Reflect.set(proto, prop, newValue)
          if (status) {
            // console.log('prop', prop, 'in', proto)
            return status
          }
        }
      }

      let value = newValue
      if (modes.noOverride) {
        if (target.hasOwnProperty(prop)) {
          console.log(prop, 'is in ', target)
          return true
        }
        if (typeof value === 'function') value = computedState.call(_this, value, prop)
      }

      if (isObject(value)) value = reactify.call(_this, value, [...path, prop])

      let success
      if (modes.reactive) {
        if (!(prop === 'length' && Array.isArray(target))) {
          if (!deepEqual(target[prop], value)) {
            success = Reflect.set(target, prop, value)
            onMutate.call(_this, [...path, prop])
          }
        }
      }

      return success || Reflect.set(target, prop, value)
    },

    deleteProperty (target, prop) {
      if (modes.reactive) onMutate.call(_this, [...path, prop])
      return Reflect.deleteProperty(target, prop)
    },

    get (target, prop) {
      if (modes.detective) {
        if (path.length !== 0) accessed.paths[accessed.paths.length - 1] = [...path, prop]
        else accessed.paths.push([...path, prop])
      }

      if (prop === '__parent__') return proto
      if (prop === '__host__') return _this

      if (prop in target) return Reflect.get(target, prop)
      else return Reflect.get(proto, prop)
    }

  })
}

export default reactify
