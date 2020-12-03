/**
 * this function is called when any textNode is updated, this is for dev only
 * @param {HTMLElement} textNode
 */

function onNodeUpdate (textNode) {
  const parentStyle = textNode.parentNode.style
  if (parentStyle) {
    parentStyle.background = '#55efc4'
    setTimeout(() => {
      parentStyle.background = null
    }, 300)
  }
}

export default onNodeUpdate
