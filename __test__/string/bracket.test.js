import { isBracketed, unBracket } from '../../src/utils/string/bracket'

describe('isBracketed', () => {
  it('returns true if the string is bracketed', () => {
    expect(isBracketed('[this is nuejs]')).toBe(true)
  })

  it('returns false if the string is not bracketed', () => {
    expect(isBracketed('[this is nuejs')).toBe(false)
    expect(isBracketed('this is nuejs]')).toBe(false)
    expect(isBracketed('this is nuejs')).toBe(false)
    expect(isBracketed('this [is nue]js')).toBe(false)
  })
})

describe('unBracket', () => {
  it('removes first and last character from string', () => {
    expect(unBracket('abcd')).toBe('bc')
    expect(unBracket('this is')).toBe('his i')
  })

  it('returns empty string, if the input string has less than 2 characters', () => {
    expect(unBracket('ab')).toBe('')
    expect(unBracket('a')).toBe('')
    expect(unBracket('')).toBe('')
  })
})
