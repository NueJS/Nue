const globalInfo = {
  _hash: 0,
  hash: () => globalInfo._hash++,
  components: {},
  actions: {},
  renderedComps: {},
  defaultStyle: ':host{display: block;}'
}

export default globalInfo
