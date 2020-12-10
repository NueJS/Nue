function add_slice_dependency (path, cb, type = 'dom') {
  let target = this.slice_deps
  const lastIndex = path.length - 1
  path.forEach((c, i) => {
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

  // cleanup - remove the added dep from slice_deps
  return () => target.$[type].delete(cb)
}

export default add_slice_dependency
