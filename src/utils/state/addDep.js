import { cbQueuer } from '../callbacks.js'

// add the callback in queue when data in the given path in state is mutated
// call the callback when queue is executed

function hasPath (obj, path) {
  let target = obj

  for (const p of path) {
    if (target.hasOwnProperty(p)) target = target[p]
    else return false
  }

  return true
}

// find from which host the value is coming from in the prototype chain
function getHost (obj, path) {
  let target = obj
  while (!hasPath(target, path)) {
    target = target.__parent__
  }
  return target.__host__
}

function addDep (path, cb, type) {
  const dis = getHost(this.$, path)
  const qcb = cbQueuer.call(dis, cb, type)
  // console.log(path, 'depends on : ', dis)
  let target = dis.deps
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
