const globalInfo = {
  _hash: 0,
  hash: () => globalInfo._hash++
}

export default globalInfo
