// only trigger cbs in $ Map
export const trigger$Cbs = (nue, target) => {
  target.$.forEach(cb => cb())
}

// trigger all the cbs in the object
export const triggerAllCbs = (nue, target) => {
  for (const k in target) {
    if (k === '$') trigger$Cbs(nue, target)
    else triggerAllCbs(nue, target[k])
  }
}

// find callbacks that are subscribed to given path and trigger them
export const triggerDeps = (nue, path) => {
  let target = nue.subscriptions
  path.forEach((c, i) => {
    // if primitive, return
    if (typeof target !== 'object') return
    target = target[c]
    if (target) {
      // if last index, trigger cbs of target.$
      if (i !== path.length - 1) trigger$Cbs(nue, target)
      // deeply trigger all inside target.*
      triggerAllCbs(nue, target)
    }
  })
}
