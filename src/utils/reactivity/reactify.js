import onMutate from '../state/onMutate.js'
import modes from './modes.js'
import computedState from '../state/computedState.js'
import { accessed } from '../state/detectStateUsage.js'
import deepEqual from '../deepEqual.js'
import { DETECTIVE_MODE, NO_OVERRIDE_MODE, REACTIVE_MODE, TARGET } from '../constants.js'

const isObject = x => typeof x === 'object' && x !== null

// create a reactive object which when mutated calls the on_change function
const reactify = (nue, obj, path = [], closure$) => {
  if (!isObject(obj)) return obj

  // make the slice of state reactive
  const target = Array.isArray(obj) ? [] : {}
  Object.keys(obj).forEach(key => {
    target[key] = reactify(nue, obj[key], [...path, key])
  })

  const reactive = new Proxy(target, {

    has (target, property) {
      // check if the property is in target or its closure
      return property in target || (closure$ ? property in closure$ : false)
    },

    set (target, prop, newValue) {
      let success
      // if the mutated prop exists in the target already
      const propInTarget = prop in target

      let value = newValue

      // do not override the state set by parent component by default value of the state added in component
      if (modes[NO_OVERRIDE_MODE]) {
        // ignore set
        if (propInTarget) return true
        if (typeof value === 'function') value = computedState(nue, value, prop)
      }

      // if the prop is not in target but is in it's closure state
      // then set the value in the closure state instead
      else if (!propInTarget && closure$ && prop in closure$) {
        return Reflect.set(closure$, prop, newValue)
      }

      if (isObject(value) && !value.__reactive__) {
        value = reactify(nue, value, [...path, prop])
      }

      if (modes[REACTIVE_MODE]) {
        if (!(prop === 'length' && Array.isArray(target))) {
          if (!deepEqual(target[prop], value)) {
            success = Reflect.set(target, prop, value)
            onMutate(nue, [...path, prop])
          }
        }
      }

      return success || Reflect.set(target, prop, value)
    },

    deleteProperty (target, prop) {
      if (modes[REACTIVE_MODE]) onMutate(nue, [...path, prop])
      return Reflect.deleteProperty(target, prop)
    },

    get (target, prop) {
      if (prop === '__reactive__') return true
      if (prop === TARGET) return target
      if (modes[DETECTIVE_MODE]) {
        if (path.length !== 0) accessed.paths[accessed.paths.length - 1] = [...path, prop]
        else accessed.paths.push([...path, prop])
      }

      // closure state API
      if (prop in target) return Reflect.get(target, prop)
      if (closure$) return Reflect.get(closure$, prop)
    }

  })

  return reactive
}

export default reactify
