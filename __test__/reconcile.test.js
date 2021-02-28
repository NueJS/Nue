import { REACTIVE_MODE } from '../src/utils/constants'
import reconcile from '../src/utils/process/loop/diff/reconcile'
import modes from '../src/utils/reactivity/modes'
import reactify from '../src/utils/reactivity/reactify'

modes[REACTIVE_MODE] = true
let $, nue

beforeEach(() => {
  nue = {
    batchInfo: []
  }
  const state = {
    arr: ['A', 'B', 'C', 'D', 'E']
  }
  $ = reactify(nue, state)
})

// ----------------
test('no change', () => {
  // do nothing
  reconcile(oldState, newState)
  matches(() => {}, [])
})
