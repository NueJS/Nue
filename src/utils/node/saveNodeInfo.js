let i = 0
function saveNodeInfo () {
  const id = i++
  this.memo.nodes[id] = { }
  return this.memo.nodes[id]
}

export default saveNodeInfo
