const { placeholder_type } = require('../../src/utils/constants')
const { process_placeholder } = require('../../src/utils/string/placeholder')

describe('reactive placeholder', () => {
  test('simple', () => {
    const output = process_placeholder('[cool]')
    expect(output).toEqual({
      type: placeholder_type.REACTIVE,
      value: ['cool'],
      content: 'cool'
    })
  })

  test('deep', () => {
    const output = process_placeholder('[foo.bar.bazz]')
    expect(output).toEqual({
      type: placeholder_type.REACTIVE,
      value: ['foo', 'bar', 'bazz'],
      content: 'foo.bar.bazz'
    })
  })

  test('with spaces', () => {
    const output = process_placeholder('[ foo.bar.bazz ]')
    expect(output).toEqual({
      type: placeholder_type.REACTIVE,
      value: ['foo', 'bar', 'bazz'],
      content: 'foo.bar.bazz'
    })
  })
})

describe('functional placeholder', () => {
  test('without spaces and simple arguments', () => {
    const output = process_placeholder('[foo(bar, bazz)]')
    expect(output).toEqual({
      type: placeholder_type.FN,
      value: {
        fn_name: 'foo',
        args: [
          ['bar'],
          ['bazz']
        ]
      }
    })
  })

  test('with spaces and simple arguments', () => {
    const output = process_placeholder('[ foo( bar, bazz ) ]')
    expect(output).toEqual({
      type: placeholder_type.FN,
      value: {
        fn_name: 'foo',
        args: [
          ['bar'],
          ['bazz']
        ]
      }
    })
  })

  test('complex arguments', () => {
    const output = process_placeholder('[ foo( a.a1.a2, b.b1, c.c1.c2 ) ]')
    expect(output).toEqual({
      type: placeholder_type.FN,
      value: {
        fn_name: 'foo',
        args: [
          ['a', 'a1', 'a2'],
          ['b', 'b1'],
          ['c', 'c1', 'c2']
        ]
      }
    })
  })
})
