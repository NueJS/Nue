import { onMutate } from '../state/onMutate.js'
import { modes } from './modes.js'
import { computedState } from '../state/computedState.js'
import { accessed } from '../state/detectStateUsage.js'
import { IS_REACTIVE, TARGET, UPDATE_INDEX } from '../../constants.js'
import { isObject } from '../others.js'

/**
 * @typedef {Record<string|number|symbol, any>} target
 */

/**
 * create a reactive state on compNode
 * @param {Comp} comp
 * @param {State} obj
 * @param {StatePath} _statePath
 * @returns {State}
 */
export const reactify = (comp, obj, _statePath = []) => {

  const closure$ = comp.parent && comp.parent.$

  let statePath = _statePath
  if (!isObject(obj)) return obj

  // make the child objects reactive
  /** @type {target} */
  const target = Array.isArray(obj) ? [] : {}
  Object.keys(obj).forEach(key => {
    target[key] = reactify(comp, obj[key], [...statePath, key])
  })

  const reactive = new Proxy(target, {
    has (target, prop) {
      // return true if the prop is in target or its closure
      return prop in target || (closure$ ? prop in closure$ : false)
    },

    set (target, prop, newValue) {
      // short circuit if the set is redundant

      if (target[/** @type {string}*/(prop)] === newValue) return true

      // change the reactive object's statePath, because it has been moved to a different key
      if (prop === UPDATE_INDEX) {
        // newValue is the index at which the reactive is moved
        statePath = [...statePath.slice(0, -1), newValue]
        return true
      }

      // if the mutated prop exists in the target already
      const propInTarget = prop in target

      let value = newValue

      // do not override the state set by parent component by default value of the state added in component
      if (modes._noOverride) {
        // ignore set
        if (propInTarget) return true

        if (typeof value === 'function') {
          value = computedState(comp, value, /** @type {string}*/(prop))
        }
      }

      // if the prop is not in target but is in it's closure state
      // then set the value in the closure state instead
      else if (!propInTarget && closure$ && prop in closure$) {
        return Reflect.set(closure$, prop, newValue)
      }

      if (isObject(value)) {
        // if value is not reactive, make it reactive

        if (!value[IS_REACTIVE]) {
          value = reactify(comp, value, [...statePath, /** @type {string}*/(prop)])
        }
        // when a reactive value is set on some index(prop) in target array
        // we have to update that reactive object's statePath - because we are changing the index it was created at
        else if (Array.isArray(target)) value[UPDATE_INDEX] = prop
      }

      // -----------------------------
      const set = () => Reflect.set(target, prop, value)

      if (modes._reactive) {
        // push to BATCH_INFO and call onMutate

        const oldValue = target[/** @type {string}*/(prop)]
        const newValue = value
        const success = set()
        if (oldValue !== newValue) {
          const livePath = () => [...statePath, /** @type {string}*/(prop)]

          const mutatedPath = /** @type {StatePath}*/(livePath())
          // statePath may have changed of reactive object, so add a getPath property to fetch the fresh statePath

          comp._mutations.push({ oldValue, newValue, path: mutatedPath, livePath })

          onMutate(comp, mutatedPath)
        }

        return success
      }

      return set()
    },

    deleteProperty (target, prop) {
      if (modes._reactive) onMutate(comp, [...statePath, /** @type {string}*/(prop)])
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
      if (closure$) return Reflect.get(closure$, prop)
    }

  })

  return reactive
}
