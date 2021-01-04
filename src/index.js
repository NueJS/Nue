import defineComponent from './defineComponent.js'
import globalInfo from './globalInfo.js'
import DEV from './utils/dev/DEV.js'
import errors from './utils/dev/errors.js'
export { default as devtools } from './devtools.js'

export const defineActions = (obj) => {
  // ensure defineActions is only called once
  if (DEV) {
    if (defineActions.calledOnce) {
      errors.FN_CALLED_MORE_THAN_ONCE('defineActions')
    } else {
      defineActions.calledOnce = true
    }
  }

  globalInfo.actions = obj
}

// this should be called once
export const define = (obj) => {
  // ensure define is only called once
  if (DEV) {
    if (define.calledOnce) {
      errors.FN_CALLED_MORE_THAN_ONCE('define')
    } else {
      define.calledOnce = true
    }
  }

  globalInfo.components = obj
}

// define the custom element of given name
export const render = (name) => {
  // get the component fn from components object
  const comp = globalInfo.components[name]

  if (DEV) {
    // if component is not defined yet
    if (!comp) errors.RENDER_CALLED_BEFORE_DEFINE(name)

    // if the component is already rendered
    // @QUESTION should this error be ignored ?
    if (globalInfo.renderedComps[name]) {
      errors.COMPONENT_ALREADY_RENDERED(name)
    }
  }

  // mark this component as rendered - to ensure that this is not rendered again
  globalInfo.renderedComps[name] = true

  defineComponent(name, comp)
}
