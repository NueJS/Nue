import { isUpper, lower } from '../others'

const dashify = (str) => {
  let dashed = lower(str[0])
  let dashAdded = false
  for (let i = 1; i < str.length; i++) {
    const c = str[i]
    if (c === '-') dashAdded = true
    if (isUpper(c)) {
      dashed += '-' + lower(c)
      dashAdded = true
    } else dashed += c
  }

  if (!dashAdded) dashed += '-'

  return dashed
}

export default dashify
