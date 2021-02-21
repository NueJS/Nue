import { arrayToHash, swap } from '../src/utils/others'
import reconcile, { created, removed, swapped } from '../src/utils/process/loop/diff/reconcile'

const getState = values => {
  const keys = values.map(value => value * 2)
  return {
    values,
    keys,
    keyHash: arrayToHash(keys)
  }
}

const matches = (fn, expectedSteps) => {
  const values = [10, 20, 30, 40]
  fn(values)

  const newState = getState(values)
  const steps = reconcile(oldState, newState)

  expect(steps).toEqual(expectedSteps)
  expect(oldState).toEqual(newState)
}

let oldState
beforeEach(() => {
  oldState = getState([10, 20, 30, 40])
})

// --------------------------------------------
test('no change', () => {
  matches(() => {}, [])
})

test('PUSH: single', () => {
  const action = values => {
    values.push(50)
  }
  const steps = [created(4, 50)]
  matches(action, steps)
})

test('PUSH: multiple', () => {
  const action = values => {
    values.push(50)
    values.push(60)
    values.push(70)
  }

  const steps = [created(4, 50), created(5, 60), created(6, 70)]
  matches(action, steps)
})

test('SHIFT: single', () => {
  const action = values => {
    values.shift()
  }

  const steps = [removed(0)]
  matches(action, steps)
})

test('SHIFT: multiple', () => {
  const action = values => {
    values.shift()
    values.shift()
  }

  const steps = [removed(0), removed(0)]
  matches(action, steps)
})

// add new item at the start of the array
test('UNSHIFT: single', () => {
  const action = values => {
    values.unshift(50)
  }

  const steps = [created(0, 50)]

  matches(action, steps)
})

test('UNSHIFT: multiple', () => {
  const action = values => {
    values.unshift(50)
    values.unshift(60)
  }

  const steps = [created(0, 60), created(1, 50)]

  matches(action, steps)
})

test('SWAP: single', () => {
  const action = values => {
    swap(values, 0, 3)
  }

  const steps = [swapped(0, 3)]

  matches(action, steps)
})

test('SWAP: multiple', () => {
  // 10, 20, 30, 40
  const action = values => {
    swap(values, 0, 1) // 20, 10, 30, 40
    swap(values, 0, 3) // 40, 10, 30, 20
    swap(values, 0, 2) // 30, 10, 40, 20
  }

  const steps = [swapped(0, 1), swapped(0, 3), swapped(0, 2)]

  matches(action, steps)
})

test('PUSH + SWAP', () => {
  const action = values => {
    values.push(50)
    swap(values, 0, 2)
  }

  const steps = [created(4, 50), swapped(0, 2)]

  matches(action, steps)
})

test('PUSH + UNSHIFT', () => {
  const action = values => {
    values.unshift(50)
    values.push(60)
  }

  const steps = [created(0, 50), created(5, 60)]

  matches(action, steps)
})

test('PUSH + SHIFT', () => {
  const action = values => {
    values.shift()
    values.push(50)
  }

  const steps = [removed(0), created(3, 50)]

  matches(action, steps)
})

test('PUSH + SWAP', () => {
  const action = values => {
    values.push(50)
    swap(values, 0, 3)
    swap(values, 1, 2)
  }

  const steps = [created(4, 50), swapped(0, 3), swapped(1, 2)]

  matches(action, steps)
})

test('SHIFT + SWAP', () => {
  const action = values => {
    values.shift()
    values.shift()
    values.shift()
    values.unshift(50)
    values.unshift(60)
  }

  const steps = [removed(0), removed(0), removed(0), created(0, 60), created(1, 50)]
  matches(action, steps)
})

test('SHIFT + UNSHIFT', () => {
  // [50, 20, 30, 40]
  const action = values => {
    values.shift()
    values.unshift(50)
  }

  const steps = [removed(0), created(0, 50)]
  matches(action, steps)
})

test('UNSHIFT + SWAP', () => {
  // [50, 20, 10, 40, 30]
  const action = values => {
    values.unshift(50)
    swap(values, 1, 2)
    swap(values, 3, 4)
  }
  const steps = [created(0, 50), swapped(1, 2), swapped(3, 4)]
  matches(action, steps)
})

test('SPLICE ADD', () => {
  // [10, 50, 20, 60, 30, 40]
  const action = values => {
    values.splice(1, 0, 50)
    values.splice(3, 0, 60)
  }

  const steps = [created(1, 50), created(3, 60)]
  matches(action, steps)
})

test('SPLICE REMOVE', () => {
  // [10, 40]
  const action = values => {
    values.splice(1, 1)
    values.splice(1, 1)
  }
  const steps = [removed(1), removed(1)]
  matches(action, steps)
})

test('SPLICE ADD + SPLICE REMOVE', () => {
  // [10, 30, 60, 50, 70]
  const action = values => {
    values.splice(1, 1)
    values.splice(2, 0, 60)
    values.splice(3, 0, 50)
    values.splice(4, 0, 70)
  }
  const steps = [removed(1), created(2, 60), created(3, 50), created(4, 70)]
  matches(action, steps)
})

test('SPLICE ADD + SPLICE REMOVE + SWAP', () => {
  // [40, 30, 10, 60, 50]
  const action = values => {
    values.splice(1, 1)
    values.splice(3, 0, 60)
    values.splice(4, 0, 50)
    swap(values, 0, 2)
  }

  const steps = [removed(1), created(3, 60), created(4, 50), swapped(0, 2)]

  matches(action, steps)
})
