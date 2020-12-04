import { split } from '../src/utils/str.js'

test('split detects variable at the start of the string', () => {
  const parts = split('{$.a.b}abcdefghi')
  expect(parts).toEqual([
    { string: '$.a.b', isVariable: true },
    { string: 'abcdefghi' }
  ])
})

test('split detects variable at the end of the string', () => {
  const parts = split('abcdefghi{$.a.b}')
  expect(parts).toEqual([
    { string: 'abcdefghi' },
    { string: '$.a.b', isVariable: true }
  ])
})

test('split detects variable at the middle of the string', () => {
  const parts = split('abcdefghi{$.a.b}abcdefghi')
  expect(parts).toEqual([
    { string: 'abcdefghi' },
    { string: '$.a.b', isVariable: true },
    { string: 'abcdefghi' }
  ])
})

test('split detects multiple variables', () => {
  const parts = split('xx{$.a.b}xx{$.c.d}xx{$.e.f}xx')
  expect(parts).toEqual([
    { string: 'xx' },
    { string: '$.a.b', isVariable: true },
    { string: 'xx' },
    { string: '$.c.d', isVariable: true },
    { string: 'xx' },
    { string: '$.e.f', isVariable: true },
    { string: 'xx' }
  ])
})

test('split throws error if bracket is opened but not closed', () => {
  expect(() => {
    split('{xxx')
  }).toThrow()
})
