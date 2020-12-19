import defineComponent from './defineComponent.js'
export { default as settings } from './settings.js'

export const supersweet = {
  components: {},
  actions: {},
  processedComponents: {}
}

export const defineActions = (obj) => {
  supersweet.actions = obj
}

export const defineComponents = (obj) => {
  supersweet.components = obj
}

export const render = (name) => {
  supersweet.processedComponents[name] = true
  defineComponent(name, supersweet.components[name])
}
