const { default: split } = require('../../src/utils/string/split')
const { TEXT, REACTIVE } = require('../../src/utils/constants.js')

it('can split the plain text only', () => {
  const parts = split('this is just plain text')
  expect(parts[0].text).toEqual('this is just plain text')
  expect(parts[0].type).toBe(TEXT)
})

it('can split the reactive placeholder only', () => {
  const parts = split('[name]')
  expect(parts[0].type).toEqual(REACTIVE)
  expect(parts[0].deps).toEqual([['name']])
  expect(parts[0].content).toBe('name')
})

it('can split the plain text and simple reactive placeholder', () => {
  const parts = split('my name is [name]')
  expect(parts[0]).toEqual({
    type: TEXT,
    text: 'my name is '
  })

  expect(parts[1].type).toEqual(REACTIVE)
  expect(parts[1].deps).toEqual([['name']])
  expect(parts[1].content).toBe('name')
})

test('it can split the plain text and complex reactive placeholder', () => {
  const parts = split('my name is [ user.name.first ], [user.name.last].')
  // 'my name is '
  expect(parts[0]).toEqual({
    type: TEXT,
    text: 'my name is '
  })

  // '[user.name.first]'
  expect(parts[1].type).toEqual(REACTIVE)
  expect(parts[1].deps).toEqual([['user', 'name', 'first']])
  expect(parts[1].content).toBe('user.name.first')

  // ', '
  expect(parts[2]).toEqual({
    type: TEXT,
    text: ', '
  })

  // '[user.name.last]'
  expect(parts[3].type).toEqual(REACTIVE)
  expect(parts[3].deps).toEqual([['user', 'name', 'last']])
  expect(parts[3].content).toBe('user.name.last')
})

it('ignores the bracket if prefixed with ! character and removes the ! character', () => {
  const parts = split('my name is ![name]')
  expect(parts[0].text).toEqual('my name is [name]')
  expect(parts[0].type).toBe(TEXT)
})
