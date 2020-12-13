import { cbQueuer } from '../callbacks.js'

// add the callback in queue when data in the given path in state is mutated
// call the callback when queue is executed
function addDep (path, cb, type) {
  const qcb = cbQueuer.call(this, cb, type)
  let target = this.deps
  const lastIndex = path.length - 1

  path.forEach((c, i) => {
    if (!target[c]) target[c] = { $: new Map() }
    target = target[c]
    if (i === lastIndex) target.$.set(qcb, true)
  })

  // return cleanup to stop DOM updates when node is removed
  if (type === 'dom') return () => target.$.delete(qcb)
}

export default addDep
