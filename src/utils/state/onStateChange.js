function onStateChange (chain, cb) {
  let target = this.stateDeps
  const lastIndex = chain.length - 2
  chain.slice(1).forEach((c, i) => {
    if (!target[c]) {
      target[c] = {
        $: []
      }
    }
    target = target[c]
    if (i === lastIndex) {
      target.$.push(cb)
    }
  })
}

export default onStateChange
