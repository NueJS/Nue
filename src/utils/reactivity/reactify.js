import onChange from './onChange.js'
// import onStateChange from '../reactivity/onStateChange.js'
import { mutate } from './mutate.js'
const isObject = x => typeof x === 'object' && x !== null

// when detection mode is enabled is records all the keys that are accessed in state
// if state.a.b and state.c.d.e is accessed it becomes ['a', 'c']
let keyAccesses = []

let detectionMode = false
let disableOnChange = false
const setDisableOnChange = v => { disableOnChange = v }
// const setDetectionMode = v => { detectionMode = v }

function detectStateKeysUsed (fn) {
  detectionMode = true
  const returnVal = fn()
  detectionMode = false
  const deps = [...keyAccesses]
  keyAccesses = [] // reset keyAccesses
  return [returnVal, deps]
}

function handleReactiveSlice (fn, chain) {
  const [initValue, deps] = detectStateKeysUsed(fn)
  console.log({ deps })
  let prevValue = initValue

  // when any of its deps changes, update its value
  const onDepUpdate = () => {
    const value = fn()
    if (prevValue !== value) {
      mutate(this.state, chain, value, 'set')
      prevValue = value
    }
  }

  this.on.update(onDepUpdate, deps)
  return initValue
}

function initializeState (chain, target) {
  return (stateObj) => {
    Object.keys(stateObj).forEach(k => {
      let value = stateObj[k]
      if (typeof value === 'function') {
        value = handleReactiveSlice.call(this, value, [...chain, k])
      }
      target[k] = value
    })
  }
}

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
      if (detectionMode) keyAccesses.push([...chain, prop].join('.'))
      if (prop === 'init') return initializeState.call(_this, chain, target)
      else if (prop === '__isRadioactive__') return true
      else if (prop === '__setDisableOnChange__') return setDisableOnChange
      return Reflect.get(target, prop)
    }

  })
}

export default reactify
