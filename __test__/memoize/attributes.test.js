const { attribute_type } = require('../../src/utils/constants')
const { default: memoize_attributes } = require('../../src/utils/memoize/attributes')

// name=[path]
let element, _this
const memo_id = 0

beforeEach(() => {
  element = document.createElement('div')

  _this = {
    memo: {
      nodes: []
    }
  }
})

test('SHORTHAND', () => {
  // i was not able not add '[count]' as attribute name directly, that's why i added on p
  element.innerHTML = '<div>  <p [count]> </p> </div>'
  const para_element = element.querySelector('p')
  memoize_attributes.call(_this, para_element, memo_id)
  const { name, type, is_placeholder } = _this.memo.nodes[memo_id].attributes[0]
  expect(name).toBe('count')
  expect(type).toBe(attribute_type.SHORTHAND)
  expect(is_placeholder).toBe(true)
})

test('NORMAL', () => {
  element.setAttribute('data-count', '[count]')
  memoize_attributes.call(_this, element, memo_id)
  const { name, path, type, content, is_placeholder, fn_info } = _this.memo.nodes[memo_id].attributes[0]
  expect(path).toEqual(['count'])
  expect(name).toBe('data-count')
  expect(content).toBe('count')
  expect(type).toBe(attribute_type.NORMAL)
  expect(is_placeholder).toBe(true)
  expect(fn_info).toBe(undefined)
})
