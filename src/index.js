import defineComponent from './defineComponent.js'

export const components = (comps) => {
  Object.keys(comps).forEach(name => defineComponent(name, comps[name]))
}
