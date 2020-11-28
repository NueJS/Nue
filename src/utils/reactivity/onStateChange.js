function onStateChange (chain, cb) {
  let target = this.stateDeps
  const lastIndex = chain.length - 1
  chain.forEach((c, i) => {
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

  return () => {
    target.$ = target.$.filter(f => f !== cb)
  }
}

export default onStateChange
