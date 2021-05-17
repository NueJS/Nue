export const data = {
  /** @type Record<string, CompDef> */
  _components: {},
  _config: {
    defaultCSS: ''
  }
}

export const devTool = {
  errorThrown: false,
  /**
   * called when node has been updated
   * @param {Node} node
   */
  nodeUpdated: (node) => {}
}
