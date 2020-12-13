import defineComponent from './defineComponent.js'
export { default as settings } from './settings.js'

export const supersweet = {
  components: {},
  actions: {},
  processedComponents: {}
}

export const actions = (obj) => {
  supersweet.actions = obj
}

export const components = (obj) => {
  supersweet.components = obj
}

export const render = (name) => {
  defineComponent(name, supersweet.components[name])
}
