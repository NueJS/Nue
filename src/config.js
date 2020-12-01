import nodeUpdated from './devtools/nodeUpdated.js'

const config = {
  showUpdates: false,
  nodeUpdated,
  commonCSS: ':host {display: block;}',
  loadedComponents: {},
  paths: {},
  elements: {}
}

export default config
