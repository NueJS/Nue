const { render } = require('../../src/index.js')

/**
 * prepare document and call the render() method
 * @param {NueComp} comp
 * @returns {Comp}
 */
export const useRender = (comp) => {
  // @ts-expect-error
  global._DEV_ = true
  document.body.innerHTML = `<${comp.name}> </${comp.name}>`
  return render(comp)
}
