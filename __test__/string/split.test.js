const { default: split } = require('../../src/utils/string/split')
const { TEXT, REACTIVE, FN } = require('../../src/utils/constants.js')

test('text', () => {
  const parts = split({}, 'this is just plain text')
  expect(parts[0].text).toEqual('this is just plain text')
  expect(parts[0].type).toBe(TEXT)
})

test('reactive variable', () => {
  const parts = split({}, '{{ foo }}')
  expect(parts[0].deps).toEqual([['foo']])
  expect(parts[0].type).toBe(REACTIVE)
})

test('function call variable', () => {
  const parts = split({}, '{{ foo(a, b.c) }}')
  expect(parts[0].type).toBe(FN)
  expect(parts[0].deps).toEqual([['a'], ['b', 'c']])
})

test('text and variable', () => {
  const parts = split({}, 'count is {{ a.b.c }} and name is {{ foo(a, b.c) }}')
  // text
  expect(parts[0].type).toBe(TEXT)
  expect(parts[0].text).toBe('count is ')

  // variable
  expect(parts[1].type).toBe(REACTIVE)
  expect(parts[1].deps).toEqual([
    ['a', 'b', 'c']
  ])

  // text
  expect(parts[2].type).toBe(TEXT)
  expect(parts[2].text).toBe(' and name is ')

  // variable
  expect(parts[3].type).toBe(FN)
  expect(parts[3].deps).toEqual([['a'], ['b', 'c']])
})
