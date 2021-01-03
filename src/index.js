import defineComponent from './defineComponent.js'
import globalInfo from './globalInfo.js'
import DEV from './utils/dev/DEV.js'
import err from './utils/dev/error.js'
import errors from './utils/dev/errors.js'
export { default as settings } from './settings.js'

export const defineActions = (obj) => {
  globalInfo.actions = obj
}

export const define = (obj) => {
  globalInfo.components = obj
}

export const render = (name) => {
  const comp = globalInfo.components[name]

  if (DEV) {
    if (!comp) errors.RENDER_CALLED_BEFORE_DEFINE(name)
  }

  globalInfo.renderedComps[name] = true
  defineComponent(name, comp)
}
