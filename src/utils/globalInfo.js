let hash = 0
const globalInfo = {
  hash: () => hash++,
  definedComponents: {},
  actions: {},
  defaultStyle: ':host{display: block;}'
}

window.globalInfo = globalInfo
export default globalInfo
