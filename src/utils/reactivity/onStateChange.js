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

  // remove the added cb to avoid memory leak
  const removeCb = () => {
    const index = target.$.findIndex(cb)
    target.$.splice(index, 1)
  }

  return removeCb
}

export default onStateChange
