export const call$Cbs = (target, chain) => target.$.forEach(cb => cb(chain))

export const callAllCbs = (target, chain) => {
  for (const k in target) {
    if (k === '$') call$Cbs(target, chain)
    else callAllCbs(target[k])
  }
}
