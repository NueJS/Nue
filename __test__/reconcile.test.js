import reconcile from '../src/utils/reconcile'

test('no change', () => {
  const oldArr = [1, 2, 3, 4]
  const newArr = [1, 2, 3, 4]

  const [steps, syncArr] = reconcile(oldArr, newArr)

  expect(steps).toEqual([])
  expect(syncArr).toEqual(newArr)
})

test('single push', () => {
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

test('multiple pushes', () => {
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

test('single shift', () => {
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

test('multiple shifts', () => {
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
      index: 1
    }
  ])

  expect(syncArr).toEqual(newArr)
})

test('multiple swaps', () => {
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
