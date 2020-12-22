import reconcile from '../src/utils/reconcile'

test('no change', () => {
  const oldArr = [1, 2, 3, 4]
  const newArr = [1, 2, 3, 4]

  const [steps, syncArr] = reconcile(oldArr, newArr)

  expect(steps).toEqual([])
  expect(syncArr).toEqual(newArr)
})

test('PUSH: single', () => {
  const oldArr = [10, 20, 30, 40]
  const newArr = [10, 20, 30, 40, 50]

  const [steps, syncArr] = reconcile(oldArr, newArr)

  expect(steps).toEqual([{
    type: 'create',
    index: 4,
    value: 50
  }])

  expect(syncArr).toEqual(newArr)
})

test('PUSH: multiple', () => {
  const oldArr = [10, 20, 30, 40]
  const newArr = [10, 20, 30, 40, 50, 60, 70]

  const [steps, syncArr] = reconcile(oldArr, newArr)

  expect(steps).toEqual([
    {
      type: 'create',
      index: 4,
      value: 50
    },
    {
      type: 'create',
      index: 5,
      value: 60
    },
    {
      type: 'create',
      index: 6,
      value: 70
    }
  ])

  expect(syncArr).toEqual(newArr)
})

test('SHIFT: single', () => {
  const oldArr = [10, 20, 30, 40]
  const newArr = [20, 30, 40]

  const [steps, syncArr] = reconcile(oldArr, newArr)

  expect(steps).toEqual([
    {
      type: 'remove',
      index: 0
    }
  ])

  expect(syncArr).toEqual(newArr)
})

test('SHIFT: multiple', () => {
  const oldArr = [10, 20, 30, 40]
  const newArr = [30, 40]

  const [steps, syncArr] = reconcile(oldArr, newArr)

  expect(steps).toEqual([
    {
      type: 'remove',
      index: 0
    },
    {
      type: 'remove',
      index: 0
    }
  ])

  expect(syncArr).toEqual(newArr)
})

test('UNSHIFT: single', () => {
  const oldArr = [10, 20, 30, 40]
  const newArr = [50, 10, 20, 30, 40]

  const [steps, syncArr] = reconcile(oldArr, newArr)

  expect(steps).toEqual([
    {
      type: 'create',
      index: 0,
      value: 50
    }
  ])

  expect(syncArr).toEqual(newArr)
})

test('UNSHIFT: multiple', () => {
  const oldArr = [10, 20, 30, 40]
  const newArr = [50, 60, 70, 10, 20, 30, 40]

  const [steps, syncArr] = reconcile(oldArr, newArr)

  expect(steps).toEqual([
    {
      type: 'create',
      index: 0,
      value: 50
    },
    {
      type: 'create',
      index: 1,
      value: 60
    },
    {
      type: 'create',
      index: 2,
      value: 70
    }
  ])

  expect(syncArr).toEqual(newArr)
})

test('SWAP: single', () => {
  const oldArr = [10, 20, 30, 40]
  const newArr = [40, 20, 30, 10]

  const [steps, syncArr] = reconcile(oldArr, newArr)

  expect(steps).toEqual([
    {
      type: 'swap',
      indexes: [0, 3]
    }
  ])

  expect(syncArr).toEqual(newArr)
})

test('SWAP: multiple', () => {
  const oldArr = [10, 20, 30, 40]
  const newArr = [30, 10, 40, 20]

  const [steps, syncArr] = reconcile(oldArr, newArr)

  expect(steps).toEqual([
    {
      type: 'swap',
      indexes: [0, 1]
    },
    {
      type: 'swap',
      indexes: [2, 0]
    },
    {
      type: 'swap',
      indexes: [3, 2]
    }
  ])

  expect(syncArr).toEqual(newArr)
})

test('PUSH + SWAP', () => {
  const oldArr = [10, 20, 30, 40]
  const newArr = [30, 20, 10, 40, 50]

  const [steps, syncArr] = reconcile(oldArr, newArr)

  expect(steps).toEqual([
    {
      type: 'create',
      index: 4,
      value: 50
    },
    {
      type: 'swap',
      indexes: [0, 2]
    }
  ])

  expect(syncArr).toEqual(newArr)
})

test('PUSH + SHIFT', () => {
  const oldArr = [10, 20, 30, 40]
  const newArr = [50, 10, 20, 30, 40, 60]

  const [steps, syncArr] = reconcile(oldArr, newArr)

  expect(steps).toEqual([
    {
      type: 'create',
      index: 0,
      value: 50
    },
    {
      type: 'create',
      index: 5,
      value: 60
    }
  ])

  expect(syncArr).toEqual(newArr)
})

test('PUSH + UNSHIFT', () => {
  const oldArr = [10, 20, 30, 40]
  const newArr = [20, 30, 40, 50]

  const [steps, syncArr] = reconcile(oldArr, newArr)

  expect(steps).toEqual([
    {
      type: 'remove',
      index: 0
    },
    {
      type: 'create',
      index: 3,
      value: 50
    }
  ])

  expect(syncArr).toEqual(newArr)
})

test('PUSH + SWAP', () => {
  const oldArr = [10, 20, 30, 40]
  const newArr = [40, 30, 20, 10, 50]

  const [steps, syncArr] = reconcile(oldArr, newArr)

  expect(steps).toEqual([
    {
      type: 'create',
      index: 4,
      value: 50
    },
    {
      type: 'swap',
      indexes: [0, 3]
    },
    {
      type: 'swap',
      indexes: [1, 2]
    }
  ])

  expect(syncArr).toEqual(newArr)
})

test('SHIFT + SWAP', () => {
  const oldArr = [10, 20, 30, 40, 50, 60]
  const newArr = [60, 50, 40]

  const [steps, syncArr] = reconcile(oldArr, newArr)

  expect(steps).toEqual([
    {
      type: 'remove',
      index: 0
    },
    {
      type: 'remove',
      index: 0
    },
    {
      type: 'remove',
      index: 0
    },
    {
      type: 'swap',
      indexes: [0, 2]
    }
  ])

  expect(syncArr).toEqual(newArr)
})

test('SHIFT + UNSHIFT', () => {
  const oldArr = [10, 20, 30, 40]
  const newArr = [50, 20, 30, 40]

  const [steps, syncArr] = reconcile(oldArr, newArr)

  expect(steps).toEqual([
    {
      type: 'remove',
      index: 0
    },
    {
      type: 'create',
      index: 0,
      value: 50
    }
  ])

  expect(syncArr).toEqual(newArr)
})

test('UNSHIFT + SWAP', () => {
  const oldArr = [10, 20, 30, 40]
  const newArr = [50, 20, 10, 40, 30]

  const [steps, syncArr] = reconcile(oldArr, newArr)

  expect(steps).toEqual([
    {
      type: 'create',
      index: 0,
      value: 50
    },
    {
      type: 'swap',
      indexes: [1, 2]
    },
    {
      type: 'swap',
      indexes: [3, 4]
    }
  ])

  expect(syncArr).toEqual(newArr)
})

test('SPLICE ADD', () => {
  const oldArr = [10, 20, 30, 40]
  const newArr = [10, 50, 20, 60, 30, 40]

  const [steps, syncArr] = reconcile(oldArr, newArr)

  expect(steps).toEqual([
    {
      type: 'create',
      index: 1,
      value: 50
    },
    {
      type: 'create',
      index: 3,
      value: 60
    }
  ])

  expect(syncArr).toEqual(newArr)
})

test('SPLICE REMOVE', () => {
  const oldArr = [10, 20, 30, 40]
  const newArr = [10, 40]

  const [steps, syncArr] = reconcile(oldArr, newArr)

  expect(steps).toEqual([
    {
      type: 'remove',
      index: 1
    },
    {
      type: 'remove',
      index: 1
    }
  ])

  expect(syncArr).toEqual(newArr)
})

test('SPLICE ADD + SPLICE REMOVE', () => {
  const oldArr = [10, 20, 30, 40, 50]
  const newArr = [10, 30, 60, 50, 70]

  const [steps, syncArr] = reconcile(oldArr, newArr)

  expect(steps).toEqual([
    {
      type: 'remove',
      index: 1
    },
    {
      type: 'remove',
      index: 2
    },
    {
      type: 'create',
      index: 2,
      value: 60
    },
    {
      type: 'create',
      index: 4,
      value: 70
    }
  ])

  expect(syncArr).toEqual(newArr)
})

test('SPLICE ADD + SPLICE REMOVE + SWAP', () => {
  const oldArr = [10, 20, 30, 40, 50]
  const newArr = [40, 30, 10, 60, 50]

  const [steps, syncArr] = reconcile(oldArr, newArr)

  expect(steps).toEqual([
    {
      type: 'remove',
      index: 1
    },
    {
      type: 'create',
      index: 3,
      value: 60
    },
    {
      type: 'swap',
      indexes: [0, 2]
    }
  ])

  expect(syncArr).toEqual(newArr)
})
