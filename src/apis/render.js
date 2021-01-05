import globalInfo from '../utils/globalInfo'
import DEV from '../utils/dev/DEV'
import errors from '../utils/dev/errors'
import defineComponent from '../utils/defineComponent'

// define the custom element of given name
const render = (name) => {
  // get the component fn from components object
  const comp = globalInfo.components[name]

  if (DEV) {
    if (!comp) errors.RENDER_CALLED_BEFORE_DEFINE(name, __filename)

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

export default render
