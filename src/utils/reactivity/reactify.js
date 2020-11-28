import onChange from './onChange.js'
import onStateChange from '../reactivity/onStateChange.js'
import { mutate } from './mutate.js'
const isObject = x => typeof x === 'object' && x !== null

let getHistory = []
let detectionMode = false
let disableOnChange = false
const setDisableOnChange = v => { disableOnChange = v }
const setDetectionMode = v => { detectionMode = v }

function reactify (state, chain = []) {
  if (!isObject(state)) return state

  const wrapper = Array.isArray(state) ? [] : {}
  Object.keys(state).forEach(key => {
    wrapper[key] = reactify.call(this, state[key], [...chain, key])
  })

  const _this = this

  return new Proxy(wrapper, {

    set (target, prop, value) {
      let v = value
      if (isObject(value)) v = reactify.call(_this, value, [...chain, prop])
      if (disableOnChange) return Reflect.set(target, prop, v)
      return onChange.call(_this, [...chain, prop], v, 'set')
    },

    deleteProperty (target, prop) {
      if (disableOnChange) return Reflect.deleteProperty(target, prop)
      return onChange.call(_this, [...chain, prop], undefined, 'deleteProperty')
    },

    get (target, prop) {
      if (detectionMode) {
        getHistory.push([...chain, prop].join('.'))
      }
      // initialize state
      if (prop === 'init') { return (obj) => {
        Object.keys(obj).forEach(k => {
          let v = obj[k]
          if (typeof v === 'function') {
            setDetectionMode(true)
            v = v()
            setDetectionMode(false)
            _this.on.update(() => {
              const value = obj[k]()
              mutate(_this.state, [...chain, k], value, 'set')
            }, getHistory)
            getHistory = []
          }
          target[k] = v
        })
      } }
      else if (prop === '__isRadioactive__') return true
      else if (prop === '__setDisableOnChange__') return setDisableOnChange

      return Reflect.get(target, prop)
    }

  })
}

export default reactify
