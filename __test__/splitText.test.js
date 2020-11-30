import { splitText } from '../src/utils/str.js'

test('splitText detects variable at the start of the string', () => {
  const parts = splitText('{state.a.b}abcdefghi')
  expect(parts).toEqual([
    { string: 'state.a.b', isVariable: true },
    { string: 'abcdefghi' }
  ])
})

test('splitText detects variable at the end of the string', () => {
  const parts = splitText('abcdefghi{state.a.b}')
  expect(parts).toEqual([
    { string: 'abcdefghi' },
    { string: 'state.a.b', isVariable: true }
  ])
})

test('splitText detects variable at the middle of the string', () => {
  const parts = splitText('abcdefghi{state.a.b}abcdefghi')
  expect(parts).toEqual([
    { string: 'abcdefghi' },
    { string: 'state.a.b', isVariable: true },
    { string: 'abcdefghi' }
  ])
})

test('splitText detects multiple variables', () => {
  const parts = splitText('xx{state.a.b}xx{state.c.d}xx{state.e.f}xx')
  expect(parts).toEqual([
    { string: 'xx' },
    { string: 'state.a.b', isVariable: true },
    { string: 'xx' },
    { string: 'state.c.d', isVariable: true },
    { string: 'xx' },
    { string: 'state.e.f', isVariable: true },
    { string: 'xx' }
  ])
})

test('splitText throws error if bracket is opened but not closed', () => {
  expect(() => {
    splitText('{xxx')
  }).toThrow()
})
