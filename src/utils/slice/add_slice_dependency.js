function add_slice_dependency (chain, cb, type = 'dom') {
  let target = this.slice_deps
  const lastIndex = chain.length - 1
  chain.forEach((c, i) => {
    if (!target[c]) {
      target[c] = {
        $: {
          reactive: new Map(),
          before: new Map(),
          dom: new Map(),
          after: new Map()
        }
      }
    }

    target = target[c]
    if (i === lastIndex) {
      target.$[type].set(cb, '')
    }
  })

  // remove the added cb to avoid memory leak
  const removeCb = () => {
    const exists = target.$[type].has(cb)
    if (exists) {
      target.$[type].delete(cb)
    }
  }

  return removeCb
}

export default add_slice_dependency
