import defineComponent from './defineComponent.js'
import DEV from './utils/dev/DEV.js'
import err from './utils/dev/error.js'
export { default as settings } from './settings.js'

export const supersweet = {
  components: {},
  actions: {},
  processedComponents: {}
}

export const defineActions = (obj) => {
  supersweet.actions = obj
}

export const define = (obj) => {
  supersweet.components = obj
}

export const render = (name) => {
  const comp = supersweet.components[name]

  if (DEV) {
    if (!comp) {
      err({
        message: `tried to render component <${name}>, but not defined earlier.`
      })
    }
  }

  supersweet.processedComponents[name] = true
  defineComponent(name, comp)
}
