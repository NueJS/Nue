import { isObject } from './others'

// trigger all the cbs in the object
export const triggerAllCbs = (target) => {
  for (const k in target) {
    if (k === '$') target.$.forEach(cb => cb())
    else triggerAllCbs(target[k])
  }
}

// find callbacks that are subscribed to given path and trigger them
export const triggerDeps = (subscriptions, path) => {
  let target = subscriptions
  path.forEach((c, i) => {
    // if primitive, return
    if (!isObject(target)) return
    target = target[c]
    if (target) {
      // if last index, trigger cbs of target.$
      if (i !== path.length - 1) target.$.forEach(cb => cb())
      // deeply trigger all inside target.*
      triggerAllCbs(target)
    }
  })
}
