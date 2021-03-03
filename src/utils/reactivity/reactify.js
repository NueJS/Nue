import onMutate from '../state/onMutate.js'
import modes from './modes.js'
import computedState from '../state/computedState.js'
import { accessed } from '../state/detectStateUsage.js'
import { BATCH_INFO, DETECTIVE_MODE, IS_REACTIVE, NO_OVERRIDE_MODE, REACTIVE_MODE, TARGET, UPDATE_INDEX } from '../constants.js'
import { isObject } from '../others.js'

// create a reactive object which when mutated calls the on_change function
const reactify = (compNode, obj, _path = [], closure$) => {
  let path = _path
  if (!isObject(obj)) return obj

  // make the child objects reactive
  const target = Array.isArray(obj) ? [] : {}
  Object.keys(obj).forEach(key => {
    target[key] = reactify(compNode, obj[key], [...path, key])
  })

  const reactive = new Proxy(target, {
    has (target, prop) {
      // return true if the prop is in target or its closure
      return prop in target || (closure$ ? prop in closure$ : false)
    },

    set (target, prop, newValue) {
      // short circuit if the set is redundant
      if (target[prop] === newValue) return true

      // change the reactive object's path, because it has been moved to a different key
      if (prop === UPDATE_INDEX) {
        // newValue is the index at which the reactive is moved
        path = [...path.slice(0, -1), newValue]
        return true
      }

      // if the mutated prop exists in the target already
      const propInTarget = prop in target

      let value = newValue

      // do not override the state set by parent component by default value of the state added in component
      if (modes[NO_OVERRIDE_MODE]) {
        // ignore set
        if (propInTarget) return true
        if (typeof value === 'function') value = computedState(compNode, value, prop)
      }

      // if the prop is not in target but is in it's closure state
      // then set the value in the closure state instead
      else if (!propInTarget && closure$ && prop in closure$) {
        return Reflect.set(closure$, prop, newValue)
      }

      if (isObject(value)) {
        // if value is not reactive, make it reactive
        if (!value[IS_REACTIVE]) value = reactify(compNode, value, [...path, prop])
        // when a reactive value is set on some index(prop) in target array
        // we have to update that reactive object's path - because we are changing the index it was created at
        else if (Array.isArray(target)) value[UPDATE_INDEX] = prop
      }

      // -----------------------------
      const set = () => Reflect.set(target, prop, value)

      if (modes[REACTIVE_MODE]) {
        // push to BATCH_INFO and call onMutate
        const oldValue = target[prop]
        const newValue = value
        const success = set()
        if (oldValue !== newValue) {
          const mutatedPath = [...path, prop]
          // path may have changed of reactive object, so add a getPath property to fetch the fresh path
          compNode[BATCH_INFO].push({ oldValue, newValue, path: mutatedPath, getPath: () => [...path, prop] })
          onMutate(compNode, mutatedPath)
        }

        return success
      }

      return set()
    },

    deleteProperty (target, prop) {
      if (modes[REACTIVE_MODE]) onMutate(compNode, [...path, prop])
      return Reflect.deleteProperty(target, prop)
    },

    get (target, prop) {
      if (prop === IS_REACTIVE) return true
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
