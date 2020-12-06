const settings = {
  showUpdates: false,

  // callback function that should be called when a node is updated in DOM
  // this function is called if showUpdates in true
  // in this function you can define your own logic to create a devtool to show DOM updates

  // this function will usually be called by a textNode
  // you can not show highlights on a text node, so target its parent instead
  onNodeUpdate: null,
  commonCSS: ':host {display: block;}'
}

export default settings
