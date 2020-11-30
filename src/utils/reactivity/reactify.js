import onChange from './onChange.js'
import { mutate } from './mutate.js'

const isObject = x => typeof x === 'object' && x !== null

// when detection mode is enabled is records all the keys that are accessed in state
// if state.a.b and state.c.d.e is accessed it becomes [['a', 'b'], ['c', 'd', 'e']]
let keyAccesses = []

// flags
let detectionMode = false
let disableOnChange = false
const setDisableOnChange = v => { disableOnChange = v }

function reactify (state, chain = []) {
  if (typeof state === 'function') return state
  if (!isObject(state)) return state

  const wrapper = Array.isArray(state) ? [] : {}
  Object.keys(state).forEach(key => {
    wrapper[key] = reactify.call(this, state[key], [...chain, key])
  })

  const _this = this
  return new Proxy(wrapper, {

    set (target, prop, newValue) {
      let value = newValue
      if (isObject(value)) value = reactify.call(_this, value, chain)
      else if (prop === '$') return initializeState.call(_this, value, target)
      else if (disableOnChange) return Reflect.set(target, prop, value)
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
        return target[prop]
      }

      else if (prop === '__isRadioactive__') return true
      else if (prop === '__setDisableOnChange__') return setDisableOnChange
      return Reflect.get(target, prop)
    }

  })
}

function detectStateKeysUsed (fn) {
  detectionMode = true
  const returnVal = fn()
  detectionMode = false
  const deps = keyAccesses.map(key => key.join('.'))
  keyAccesses = [] // reset keyAccesses
  return [returnVal, deps]
}

function handleReactiveSlice (fn, k) {
  const [initValue, deps] = detectStateKeysUsed(fn)
  let prevValue = initValue

  const onDepUpdate = () => {
    const value = fn()
    if (prevValue !== value) { // only mutate if the value is actually changed
      mutate(this.state, [k], value, 'set')
      prevValue = value
    }
  }

  // when any of its deps changes, update its value
  this.on.update(onDepUpdate, deps)
  return initValue
}

function initializeState (initState, target) {
  Object.keys(initState).forEach(k => {
    let value = initState[k]
    if (typeof value === 'function') {
      value = handleReactiveSlice.call(this, value, k)
    }
    target[k] = value
  })
}

export default reactify
