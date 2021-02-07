
const updateAnchor = (anchorNode, c) => {
  anchorNode.textContent = anchorNode.textContent.slice(0, -c.length) + c
}

export default updateAnchor
