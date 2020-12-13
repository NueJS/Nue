const { BIND, SHORTHAND, NORMAL, EVENT, STATE, FN } = require('../../src/utils/constants.js')
const { default: memoAttributes } = require('../../src/utils/memoize/attributes.js')

// name=[path]
let div, _this
const sweetId = 0

beforeEach(() => {
  div = document.createElement('div')

  _this = {
    memo: {
      nodes: []
    }
  }
})

describe('REACTIVE placeholder type', () => {
  test('SHORTHAND', () => {
    // i was not able not add '[count]' as attribute name directly, that's why i added on p
    div.innerHTML = '<p [count]> </p>'
    const element = div.querySelector('p')
    memoAttributes.call(_this, element, sweetId)
    const { name, type, is_placeholder } = _this.memo.nodes[sweetId].attributes[0]
    expect(name).toBe('count')
    expect(type).toBe(SHORTHAND)
    expect(is_placeholder).toBe(true)
  })

  test('NORMAL', () => {
    div.innerHTML = '<p data-count=[a.b.c]> </p>'
    const element = div.querySelector('p')
    memoAttributes.call(_this, element, sweetId)
    const { name, path, type, content, is_placeholder, fn_info } = _this.memo.nodes[sweetId].attributes[0]
    expect(path).toEqual(['a', 'b', 'c'])
    expect(name).toBe('data-count')
    expect(content).toBe('a.b.c')
    expect(type).toBe(NORMAL)
    expect(is_placeholder).toBe(true)
    expect(fn_info).toBe(undefined)
  })

  test('EVENT', () => {
    div.innerHTML = '<p @click=[increment]> </p>'
    const element = div.querySelector('p')
    memoAttributes.call(_this, element, sweetId)
    const { name, type, content } = _this.memo.nodes[sweetId].attributes[0]
    expect(name).toBe('click')
    expect(content).toBe('increment')
    expect(type).toBe(EVENT)
  })

  test('STATE', () => {
    div.innerHTML = '<p :title=[a.b.c]> </p>'
    const element = div.querySelector('p')
    memoAttributes.call(_this, element, sweetId)
    const { name, type, content, path } = _this.memo.nodes[sweetId].attributes[0]
    expect(name).toBe('title')
    expect(content).toBe('a.b.c')
    expect(path).toEqual(['a', 'b', 'c'])
    expect(type).toBe(STATE)
  })

  test('BIND', () => {
    div.innerHTML = '<p bind:foo=[a.b.c]> </p>'
    const element = div.querySelector('p')
    memoAttributes.call(_this, element, sweetId)
    const { name, type, content, path } = _this.memo.nodes[sweetId].attributes[0]
    expect(name).toBe('foo')
    expect(content).toBe('a.b.c')
    expect(path).toEqual(['a', 'b', 'c'])
    expect(type).toBe(BIND)
  })
})

describe('FN placeholder type', () => {
  test('NORMAL', () => {
    div.innerHTML = '<p> </p>'
    const element = div.querySelector('p')
    // add attribute like this because its not working otherwise in jest
    element.setAttribute('data-count', '[sum( a, b, c.d )]')
    memoAttributes.call(_this, element, sweetId)
    const { name, type, is_placeholder, fn_info } = _this.memo.nodes[sweetId].attributes[0]

    expect(name).toBe('data-count')
    expect(type).toBe(NORMAL)
    expect(is_placeholder).toBe(true)
    expect(fn_info).toEqual({
      type: FN,
      value: {
        fn_name: 'sum',
        args: [
          ['a'],
          ['b'],
          ['c', 'd']
        ]
      }
    })
  })

  test('STATE', () => {
    div.innerHTML = '<p> </p>'
    const element = div.querySelector('p')
    element.setAttribute(':title', '[foo(bar, buzz.fizz)]')
    memoAttributes.call(_this, element, sweetId)
    const { name, type, fn_info } = _this.memo.nodes[sweetId].attributes[0]
    expect(name).toBe('title')
    expect(type).toBe(STATE)
    expect(fn_info).toEqual({
      type: FN,
      value: {
        fn_name: 'foo',
        args: [
          ['bar'],
          ['buzz', 'fizz']
        ]
      }
    })
  })

  test('BIND', () => {
    div.innerHTML = '<p bind:foo=[a.b.c]> </p>'
    const element = div.querySelector('p')
    element.setAttribute('bind:foo', '[foo(bar, buzz.fizz)]')
    memoAttributes.call(_this, element, sweetId)
    const { name, type, fn_info } = _this.memo.nodes[sweetId].attributes[0]
    expect(name).toBe('foo')
    expect(type).toBe(BIND)
    expect(fn_info).toEqual({
      type: FN,
      value: {
        fn_name: 'foo',
        args: [
          ['bar'],
          ['buzz', 'fizz']
        ]
      }
    })
  })
})
