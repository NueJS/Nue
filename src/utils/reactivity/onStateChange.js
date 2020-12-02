function onStateChange (chain, cb, type = 'dom') {
  let target = this.stateDeps
  const lastIndex = chain.length - 1
  chain.forEach((c, i) => {
    if (!target[c]) {
      target[c] = {
        $: {
          before: [],
          dom: [],
          after: []
        }
      }
    }
    target = target[c]
    if (i === lastIndex) {
      target.$[type].push(cb)
    }
  })

  // remove the added cb to avoid memory leak
  const removeCb = () => {
    const index = target.$[type].findIndex(cb)
    target.$[type].splice(index, 1)
  }

  return removeCb
}

export default onStateChange
