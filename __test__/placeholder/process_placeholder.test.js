// // const { FN, REACTIVE } = require('../../src/utils/constant.js')
// const { REACTIVE, FN } = require('../../src/utils/constants.js')
// const { processPlaceholder } = require('../../src/utils/string/placeholder.js')

// describe('reactive placeholder', () => {
//   test('simple', () => {
//     const output = processPlaceholder('[cool]')
//     expect(output).toEqual({
//       type: REACTIVE,
//       value: ['cool'],
//       content: 'cool'
//     })
//   })

//   test('deep', () => {
//     const output = processPlaceholder('[foo.bar.bazz]')
//     expect(output).toEqual({
//       type: REACTIVE,
//       value: ['foo', 'bar', 'bazz'],
//       content: 'foo.bar.bazz'
//     })
//   })

//   test('with spaces', () => {
//     const output = processPlaceholder('[ foo.bar.bazz ]')
//     expect(output).toEqual({
//       type: REACTIVE,
//       value: ['foo', 'bar', 'bazz'],
//       content: 'foo.bar.bazz'
//     })
//   })
// })

// describe('functional placeholder', () => {
//   test('without spaces and simple arguments', () => {
//     const output = processPlaceholder('[foo(bar, bazz)]')
//     expect(output).toEqual({
//       type: FN,
//       value: {
//         fn_name: 'foo',
//         args: [
//           ['bar'],
//           ['bazz']
//         ]
//       }
//     })
//   })

//   test('with spaces and simple arguments', () => {
//     const output = processPlaceholder('[ foo( bar, bazz ) ]')
//     expect(output).toEqual({
//       type: FN,
//       value: {
//         fn_name: 'foo',
//         args: [
//           ['bar'],
//           ['bazz']
//         ]
//       }
//     })
//   })

//   test('complex arguments', () => {
//     const output = processPlaceholder('[ foo( a.a1.a2, b.b1, c.c1.c2 ) ]')
//     expect(output).toEqual({
//       type: FN,
//       value: {
//         fn_name: 'foo',
//         args: [
//           ['a', 'a1', 'a2'],
//           ['b', 'b1'],
//           ['c', 'c1', 'c2']
//         ]
//       }
//     })
//   })
// })
