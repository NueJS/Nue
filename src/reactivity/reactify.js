import { onMutate } from '../state/onMutate.js'
import { modes } from './modes.js'
import { computedState } from '../state/computedState.js'
import { accessed } from '../state/detectStateUsage.js'
import { IS_REACTIVE, TARGET, UPDATE_INDEX } from '../constants.js'
import { isObject } from '../utils/type.js'

/**
 * @typedef {Record<string|number|symbol, any>} ReactiveWrapper
 */

/**
 * create a reactive state on compNode
 * @param {Comp} comp
 * @param {State} obj
 * @param {StatePath} _statePath
 * @returns {State}
 */
export const reactify = (comp, obj, _statePath = []) => {

  // can not reactify non-object
  if (!isObject(obj)) return obj

  const parent$ = comp.parent && comp.parent.$

  // statePath may change if the obj is in an array and that array is mutated
  let statePath = _statePath

  /** @type {ReactiveWrapper} */
  const wrapper = Array.isArray(obj) ? [] : {}

  Object.keys(obj).forEach(key => {
    wrapper[key] = reactify(comp, obj[key], [...statePath, key])
  })

  return new Proxy(wrapper, {

    has (target, prop) {
      // return true if the prop is in target or its closure
      return prop in target || (parent$ ? prop in parent$ : false)
    },

    set (target, prop, _newValue) {

      const oldValue = target[/** @type {string}*/(prop)]

      // do nothing if newValue is same as oldValue
      if (oldValue === _newValue) return true

      if (prop === UPDATE_INDEX) {
        // update statePath as it has been moved to a different position in array

        // replace the oldIndex with newIndex in statePath
        statePath = [...statePath.slice(0, -1), _newValue]
        return true
      }

      // if the mutated prop exists in the target already
      const propInTarget = prop in target

      let newValue = _newValue

      // state creation mode
      if (modes._setup) {
        // do not override the state set by parent component by the default value set in this component
        if (propInTarget) return true

        if (typeof newValue === 'function') {
          newValue = computedState(newValue, /** @type {string}*/(prop), comp)
        }
      }

      // if the prop is not in target but is in it's closure state
      // then set the value in the closure state instead
      else if (!propInTarget && parent$ && prop in parent$) {
        return Reflect.set(parent$, prop, newValue)
      }

      if (isObject(newValue)) {
        // if value is not reactive, make it reactive

        if (!newValue[IS_REACTIVE]) {
          newValue = reactify(comp, newValue, [...statePath, /** @type {string}*/(prop)])
        }
        // when a reactive value is set on some index(prop) in target array
        // we have to update that reactive object's statePath - because we are changing the index it was created at
        else if (Array.isArray(target)) newValue[UPDATE_INDEX] = prop
      }

      // -----------------------------

      if (oldValue !== newValue) {
        /**
         * returns the current statePath of reactive object
         * @returns {StatePath}
         */
        const livePath = () => [...statePath, /** @type {string}*/(prop)]

        const mutatedPath = livePath()

        comp._mutations.push({ oldValue, newValue, path: mutatedPath, livePath })

        onMutate(comp, mutatedPath)
      }

      return Reflect.set(target, prop, newValue)

    },

    deleteProperty (target, prop) {
      onMutate(comp, [...statePath, /** @type {string}*/(prop)])
      return Reflect.deleteProperty(target, prop)
    },

    get (target, prop) {
      if (prop === IS_REACTIVE) return true
      if (prop === TARGET) return target

      if (modes._detective) {

        /** @type {StatePath} */
        const fullPath = [...statePath, /** @type {string}*/(prop)]

        if (statePath.length !== 0) {
          accessed._paths[accessed._paths.length - 1] = fullPath
        } else {
          accessed._paths.push(fullPath)
        }
      }

      // closure state API
      if (prop in target) {
        if (modes._returnComp) return comp
        return Reflect.get(target, prop)
      }
      if (parent$) return Reflect.get(parent$, prop)
    }

  })

}
