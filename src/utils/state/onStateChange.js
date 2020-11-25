function onStateChange (chain, cb) {
  const key = chain[0]
  if (!this.stateDeps[key]) this.stateDeps[key] = []
  this.stateDeps[key].push(cb)
}

export default onStateChange
