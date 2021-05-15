// import { REACTIVE_MODE } from '../src/utils/constants'
// import modes from '../src/utils/reactivity/modes'
// import reactify from '../src/utils/reactivity/reactify'

// modes[REACTIVE_MODE] = true
// let $, nue

// beforeEach(() => {
//   nue = {
//     batchInfo: []
//   }
//   const state = {
//     arr: ['A', 'B', 'C', 'D', 'E']
//   }
//   $ = reactify(nue, state)
// })

// // -------------------------------

// describe('Array Mutations', () => {
//   test('push single', () => {
//     $.arr.push('F')
//     expect(nue.batchInfo).toEqual([
//       {
//         oldValue: undefined,
//         newValue: 'F',
//         path: ['arr', '5']
//       }
//     ])
//   })

//   test('pop single', () => {
//     $.arr.pop()
//     expect(nue.batchInfo).toEqual([
//       {
//         oldValue: 5,
//         newValue: 4,
//         path: ['arr', 'length']
//       }
//     ])
//   })

//   test('splice add single', () => {
//     $.arr.splice(2, 0, 'X')
//     // old :  ['A', 'B', 'C', 'D', 'E']
//     // new :  ['A', 'B', 'X', 'C', 'D', 'E']

//     // splice starts modifying from end
//     // old : ['A', 'B', 'C', 'D', 'E', undefined]

//     // arr[5] = 'E' -> ['A', 'B', 'C', 'D', 'E', *'E']
//     // arr[4] = 'E' -> ['A', 'B', 'C', 'D', *'D', 'E']
//     // arr[3] = 'E' -> ['A', 'B', 'C', *'C', 'D', 'E']
//     // arr[2] = 'E' -> ['A', 'B', *'X', 'C', 'D', 'E']
//     expect(nue.batchInfo).toEqual([
//       {
//         oldValue: undefined,
//         newValue: 'E',
//         path: ['arr', '5']
//       },
//       {
//         oldValue: 'E',
//         newValue: 'D',
//         path: ['arr', '4']
//       },
//       {
//         oldValue: 'D',
//         newValue: 'C',
//         path: ['arr', '3']
//       },
//       {
//         oldValue: 'C',
//         newValue: 'X',
//         path: ['arr', '2']
//       }
//     ])
//   })

//   test('splice replace single', () => {
//     $.arr.splice(2, 1, 'X')
//     // old :  ['A', 'B', 'C', 'D', 'E']
//     // new :  ['A', 'B', 'X', 'D', 'E']

//     expect(nue.batchInfo).toEqual([
//       {
//         oldValue: 'C',
//         newValue: 'X',
//         path: ['arr', '2']
//       }
//     ])
//   })

//   test('splice remove single', () => {
//     $.arr.splice(2, 1)
//     // old :  ['A', 'B', 'C', 'D', 'E']
//     // new :  ['A', 'B', 'D', 'E']

//     // splice starts modifying from end
//     // old : ['A', 'B', 'C', 'D', 'E']

//     // arr[2] = 'D' -> ['A', 'B', *'D', 'D', 'E']
//     // arr[3] = 'E' -> ['A', 'B', 'D', *'E', 'E']
//     // arr.length = 5
//     expect(nue.batchInfo).toEqual([
//       {
//         newValue: 'D',
//         oldValue: 'C',
//         path: ['arr', '2']
//       },
//       {
//         newValue: 'E',
//         oldValue: 'D',
//         path: ['arr', '3']
//       },
//       {
//         newValue: 4,
//         oldValue: 5,
//         path: ['arr', 'length']
//       }
//     ])
//   })
// })
