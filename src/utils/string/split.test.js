const { placeholderTypes } = require('enums')
const { split } = require('./split')

// these tests will be outdated - no point in fixing these tests

const { _reactive, _functional } = placeholderTypes
/**
 * @type {Comp}
 */
// @ts-expect-error
const mockComp = {}

it('can split the plain text only', () => {
  const parts = split(mockComp, 'this is just plain text')
  expect(parts).toEqual(['this is just plain text'])
})

it('can split the reactive placeholder only', () => {
  const parts = /** @type {Placeholder[]}*/(split(mockComp, '[name]'))
  expect(parts[0]._type).toEqual(_reactive)
  expect(parts[0]._stateDeps).toEqual([['name']])
  expect(parts[0]._content).toBe('name')
})

it('can split the plain text and simple reactive placeholder', () => {
  const parts = split(mockComp, 'my name is [name]')

  expect(parts[0]).toBe('my name is ')

  expect(parts[1].type).toEqual(REACTIVE)
  expect(parts[1].deps).toEqual([['name']])
  expect(parts[1].content).toBe('name')
})

test('it can split the plain text and complex reactive placeholder', () => {
  const parts = split(mockComp, 'my name is [ user.name.first ], [user.name.last].')
  // 'my name is '
  expect(parts[0]).toEqual({
    type: TEXT,
    content: 'my name is '
  })

  // '[user.name.first]'
  expect(parts[1].type).toEqual(REACTIVE)
  expect(parts[1].deps).toEqual([['user', 'name', 'first']])
  expect(parts[1].content).toBe('user.name.first')

  // ', '
  expect(parts[2]).toEqual({
    type: TEXT,
    content: ', '
  })

  // '[user.name.last]'
  expect(parts[3].type).toEqual(REACTIVE)
  expect(parts[3].deps).toEqual([['user', 'name', 'last']])
  expect(parts[3].content).toBe('user.name.last')
})

it('ignores the bracket if prefixed with ! character and removes the ! character', () => {
  const parts = split(mockComp, 'my name is ![name]')
  expect(parts[0].content).toEqual('my name is [name]')
  expect(parts[0].type).toBe(TEXT)
})

it('throws if the un-prefixed bracket is started but not closed', () => {
  expect(() => {
    split(mockComp, 'my name is [name')
  }).toThrow()
})
