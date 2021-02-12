import onMutate from '../state/onMutate.js'
import modes from './modes.js'
import computedState from '../state/computedState.js'
import { accessed } from '../state/detectStateUsage.js'
import deepEqual from '../deepEqual.js'
import { TARGET } from '../symbols.js'

const isObject = x => typeof x === 'object' && x !== null

// create a reactive object which when mutated calls the on_change function
function reactify (comp, obj, path = []) {
  const closure$ = comp.closure && comp.closure.$
  if (!isObject(obj)) return [obj]

  // make the slice of state reactive
  const target = Array.isArray(obj) ? [] : {}
  Object.keys(obj).forEach(key => {
    [target[key]] = reactify(comp, obj[key], [...path, key])
  })

  const reactive = new Proxy(target, {

    set (target, prop, newValue) {
      let success
      const propInTarget = prop in target

      let value = newValue
      if (modes.noOverride) {
        // ignore set
        if (propInTarget) return true
        if (typeof value === 'function') value = computedState(comp, value, prop)
      }

      else {
        // if prop being set is not in current state and we have closure state available
        if (closure$ && !propInTarget) {
          const success = Reflect.set(closure$, prop, newValue)
          if (success) return success
        }
      }

      if (isObject(value)) [value] = reactify(comp, value, [...path, prop])

      if (modes.reactive) {
        if (!(prop === 'length' && Array.isArray(target))) {
          if (!deepEqual(target[prop], value)) {
            success = Reflect.set(target, prop, value)
            onMutate(comp, [...path, prop])
          }
        }
      }

      return success || Reflect.set(target, prop, value)
    },

    deleteProperty (target, prop) {
      if (modes.reactive) onMutate(comp, [...path, prop])
      return Reflect.deleteProperty(target, prop)
    },

    get (target, prop) {
      if (prop === TARGET) return target
      if (modes.detective) {
        if (path.length !== 0) accessed.paths[accessed.paths.length - 1] = [...path, prop]
        else accessed.paths.push([...path, prop])
      }

      // closure state API
      if (prop in target) return Reflect.get(target, prop)
      if (closure$) return Reflect.get(closure$, prop)
      return undefined
    }

  })

  return [reactive, target]
}

export default reactify
