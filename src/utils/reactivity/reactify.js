import onChange from './onChange.js'
import { mutate } from './mutate.js'

const isObject = x => typeof x === 'object' && x !== null

// when detection mode is enabled is records all the keys that are accessed in state
// if state.a.b and state.c.d.e is accessed it becomes [['a', 'b'], ['c', 'd', 'e']]
let keyAccesses = []

// when detection mode is true, all key accessed in state is recorded in keyAccesses array
let detectionMode = false

// when disableOnChange is true any mutation in state does not trigger onChange function
let disableOnChange = false

// when initiateMode is true, setting a key in state which already exists does nothing
// this is used so that default value of state does not override the value in props
let initiateMode = false

// functions to set the flags
const setDisableOnChange = v => { disableOnChange = v }
const setInitiateMode = v => { initiateMode = v }

function reactify (state, chain = []) {
  if (!isObject(state)) return state

  const wrapper = Array.isArray(state) ? [] : {}
  Object.keys(state).forEach(key => {
    wrapper[key] = reactify.call(this, state[key], [...chain, key])
  })

  const _this = this
  return new Proxy(wrapper, {

    set (target, prop, newValue) {
      if (initiateMode && target[prop]) return true
      let value = newValue
      if (typeof value === 'function') value = handleReactiveSlice.call(_this, value, prop)
      else if (isObject(value)) value = reactify.call(_this, value, [...chain, prop])
      if (disableOnChange) return Reflect.set(target, prop, value)
      else return onChange.call(_this, [...chain, prop], value, 'set')
    },

    deleteProperty (target, prop) {
      if (disableOnChange) return Reflect.deleteProperty(target, prop)
      else return onChange.call(_this, [...chain, prop], undefined, 'deleteProperty')
    },

    get (target, prop) {
      if (detectionMode) {
        if (chain.length !== 0) keyAccesses[keyAccesses.length - 1] = [...chain, prop]
        else keyAccesses.push([...chain, prop])
      }

      else if (prop === '__isRadioactive__') return true

      // flag setting
      else if (prop === '__setDisableOnChange__') return setDisableOnChange
      else if (prop === '__setInitiateMode__') return setInitiateMode
      return Reflect.get(target, prop)
    }

  })
}

// call the function and detect what keys it is using of this.$
function detectStateKeysUsed (fn) {
  detectionMode = true
  const returnVal = fn()
  detectionMode = false
  const deps = [...keyAccesses]
  keyAccesses = [] // reset keyAccesses
  return [returnVal, deps]
}

// when initializing the state, if a function is given
// call that function, detect the state keys it depends on, get the initial value
// update its value whenever its deps changes
function handleReactiveSlice (fn, k) {
  const [initValue, deps] = detectStateKeysUsed(fn)
  let prevValue = initValue

  const onDepUpdate = () => {
    console.log('update : ', k)
    const value = fn()
    if (prevValue !== value) { // only mutate if the value is actually changed
      mutate(this.$, [k], value, 'set')
      prevValue = value
    }
  }

  // when any of its deps changes, update its value
  // depend on the root key ???
  this.on.reactiveUpdate(onDepUpdate, deps.map(d => d[0]))
  return initValue
}

export default reactify
