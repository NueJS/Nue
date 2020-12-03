let i = 0
function saveNodeInfo () {
  const id = i++
  this.config.templateInfo[id] = { }
  return this.config.templateInfo[id]
}

export default saveNodeInfo
