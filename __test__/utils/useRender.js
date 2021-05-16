const { render } = require('../../src/index.js')

/**
 * prepare document and call the render() method
 * @param {NueComp} comp
 * @param {Config} [config]
 * @returns {Comp}
 */
export const useRender = (comp, config) => {
  // @ts-expect-error
  global._DEV_ = true
  document.body.innerHTML = `<${comp.name}> </${comp.name}>`
  return render(comp, config)
}
