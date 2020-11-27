function fetchComponents (template) {
  [...template.content.children].forEach(node => {
    checkNode(node)
    if (node.children) {
      [...node.children].forEach(n => checkNode(n))
    }
  })

  function checkNode (node) {
    const elementName = node.nodeName.toLowerCase()
    const path = window.supersweet.paths[elementName]
    if (path && !window.loadedComponents[elementName]) {
      window.loadedComponents[elementName] = true
      const script = document.createElement('script')
      script.src = path
      document.head.append(script)
    }
  }
}

export default fetchComponents
