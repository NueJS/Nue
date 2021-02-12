import err from '../dev/error'

export const checkFor = (node, arr) => {
  if (arr.length < 2) {
    err({
      message: `invalid for attribute value on ${node.nodeName}`,
      code: 1,
      link: ''
    })
  }

  if (!node.parsed.for.key) {
    err({
      message: `missing attribute "key" on ${node.nodeName}.`,
      code: 2,
      link: ''
    })
  }
}
