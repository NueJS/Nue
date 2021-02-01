let hash = 0
const globalInfo = {
  hash: () => hash++,
  components: {},
  actions: {},
  renderedComps: {},
  defaultStyle: ':host{display: block;}'
}

export default globalInfo
