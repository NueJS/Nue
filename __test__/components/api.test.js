import { useRender } from "../utils/useRender"

/**
 * @param {object} x
 */
 const shouldBeObject = (x) => {
  expect(typeof x).toBe('object')
}

/**
 * @param {Function} x
 */
const shouldBeFunction = (x) => {
  expect(typeof x).toBe('function')
}

// component
class App {}

test('app renders on the page', () => {
  const el = useRender(/** @type {NueComp} */(App))

  shouldBeObject(el.refs)
  shouldBeObject(el.$)
  shouldBeObject(el.fn)

  // life cycles
  const { onMount, onDestroy, beforeUpdate, afterUpdate, onMutate } = el.events

  // expect all hooks to be functions
  shouldBeFunction(onMount)
  shouldBeFunction(onDestroy)
  shouldBeFunction(beforeUpdate)
  shouldBeFunction(afterUpdate)
  shouldBeFunction(onMutate)
})
