import defineComponent from './defineComponent.js'

// define all the components

// @TODO : do not define components all at once
// start from root - when processing template of app
// go through nodes, if a custom component is used, process that first
// do the same in that component

// if a component is hidden, do not process it
// if the component becomes unhidden check if has been processed or not
// if not, process it

export const components = (comps) => {
  Object.keys(comps).forEach(name => defineComponent(name, comps[name]))
}
