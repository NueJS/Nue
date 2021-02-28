import onMutate from '../state/onMutate.js'
import modes from './modes.js'
import computedState from '../state/computedState.js'
import { accessed } from '../state/detectStateUsage.js'
import { DETECTIVE_MODE, IS_REACTIVE, NO_OVERRIDE_MODE, REACTIVE_MODE, TARGET, UPDATE_INDEX } from '../constants.js'
import { isObject } from '../others.js'

// create a reactive object which when mutated calls the on_change function
const reactify = (nue, obj, _path = [], closure$) => {
  let path = _path
  if (!isObject(obj)) return obj

  // make the child objects reactive
  const target = Array.isArray(obj) ? [] : {}
  Object.keys(obj).forEach(key => {
    target[key] = reactify(nue, obj[key], [...path, key])
  })

  const reactive = new Proxy(target, {

    // return true if the prop is in target or its closure
    has (target, prop) {
      return prop in target || (closure$ ? prop in closure$ : false)
    },

    set (target, prop, newValue) {
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
        if (typeof value === 'function') value = computedState(nue, value, prop)
      }

      // if the prop is not in target but is in it's closure state
      // then set the value in the closure state instead
      else if (!propInTarget && closure$ && prop in closure$) {
        return Reflect.set(closure$, prop, newValue)
      }

      if (isObject(value)) {
        // if value is not reactive, make it reactive
        if (!value[IS_REACTIVE]) value = reactify(nue, value, [...path, prop])
        // when a reactive value is set on some index(prop) in target array
        // we have to update that reactive object's path - because we are changing the index it was created at
        else if (Array.isArray(target)) value[UPDATE_INDEX] = prop
      }

      // -----------------------------
      const set = () => Reflect.set(target, prop, value)

      if (modes[REACTIVE_MODE]) {
        // push to batchInfo and call onMutate
        const oldValue = target[prop]
        const newValue = value
        const success = set()
        if (oldValue !== newValue) {
          const mutatedPath = [...path, prop]
          nue.batchInfo.push({ oldValue, newValue, path: mutatedPath })
          onMutate(nue, mutatedPath)
        }

        return success
      }

      return set()
    },

    deleteProperty (target, prop) {
      if (modes[REACTIVE_MODE]) onMutate(nue, [...path, prop])
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
