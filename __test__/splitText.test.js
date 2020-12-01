import { splitText } from '../src/utils/str.js'

test('splitText detects variable at the start of the string', () => {
  const parts = splitText('{$.a.b}abcdefghi')
  expect(parts).toEqual([
    { string: '$.a.b', isVariable: true },
    { string: 'abcdefghi' }
  ])
})

test('splitText detects variable at the end of the string', () => {
  const parts = splitText('abcdefghi{$.a.b}')
  expect(parts).toEqual([
    { string: 'abcdefghi' },
    { string: '$.a.b', isVariable: true }
  ])
})

test('splitText detects variable at the middle of the string', () => {
  const parts = splitText('abcdefghi{$.a.b}abcdefghi')
  expect(parts).toEqual([
    { string: 'abcdefghi' },
    { string: '$.a.b', isVariable: true },
    { string: 'abcdefghi' }
  ])
})

test('splitText detects multiple variables', () => {
  const parts = splitText('xx{$.a.b}xx{$.c.d}xx{$.e.f}xx')
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

test('splitText throws error if bracket is opened but not closed', () => {
  expect(() => {
    splitText('{xxx')
  }).toThrow()
})
