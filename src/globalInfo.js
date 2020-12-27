const globalInfo = {
  _hash: 0,
  hash: () => globalInfo._hash++,
  components: {},
  actions: {},
  renderedComps: {}
}

export default globalInfo
