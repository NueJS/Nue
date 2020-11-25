function onStateChange (k, cb) {
  const key = k.substr(6) // remove state.
  if (!this.stateDeps[key]) this.stateDeps[key] = []
  this.stateDeps[key].push(cb)
}

export default onStateChange
