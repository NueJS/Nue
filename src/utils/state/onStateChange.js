function onStateChange (key, cb) {
  if (!this.stateDeps[key]) this.stateDeps[key] = []
  this.stateDeps[key].push(cb)
}

export default onStateChange
