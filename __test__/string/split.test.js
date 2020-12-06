const { default: split } = require('../../src/utils/string/split')

test('all text, no placeholders', () => {
  const parts = split('this is just plain text')
  expect(parts).toEqual([
    {
      string: 'this is just plain text'
    }
  ])
})

test('only placeholder', () => {
  const parts = split('[text inside placeholder]')
  expect(parts).toEqual([
    {
      string: 'text inside placeholder',
      value: ['textinsideplaceholder'] // spaces are removed
    }
  ])
})

test('text then reactive placeholder', () => {
  const parts = split('count is [a.b.c]')
  expect(parts).toEqual([
    {
      string: 'count is '
    },
    {
      string: 'a.b.c',
      value: ['a', 'b', 'c']
    }
  ])
})

test('reactive placeholder then text', () => {
  const parts = split('[a.b.c] is the count')
  expect(parts).toEqual([
    {
      string: 'a.b.c',
      value: ['a', 'b', 'c']
    },
    {
      string: ' is the count'
    }
  ])
})

test('multiple reactive placeholders and text', () => {
  const parts = split('[a.b.c] and [d.e.f] is same as [e.f.g.h]')
  expect(parts).toEqual([
    {
      string: 'a.b.c',
      value: ['a', 'b', 'c']
    },
    {
      string: ' and '
    },
    {
      string: 'd.e.f',
      value: ['d', 'e', 'f']
    },
    {
      string: ' is same as '
    },
    {
      string: 'e.f.g.h',
      value: ['e', 'f', 'g', 'h']
    }
  ])
})

test('text and functional placeholder', () => {
  const parts = split('count is [ foo(bar, bazz.fuzz) ]')
  expect(parts).toEqual([
    {
      string: 'count is '
    },
    {
      string: ' foo(bar, bazz.fuzz) ',
      value: {
        fn_name: 'foo',
        args: [
          ['bar'],
          ['bazz', 'fuzz']
        ]
      }
    }
  ])
})
