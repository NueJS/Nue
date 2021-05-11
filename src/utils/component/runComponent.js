import { modes } from '../reactivity/modes.js'

/**
 * invoke compFn with comp instance
 * @param {CompFn} compFn
 * @param {Comp} comp
 */
export const invokeCompFn = (compInstance, comp) => {

  modes._reactive = false
  modes._noOverride = true

  compInstance.js(comp)

  modes._reactive = true
  modes._noOverride = false
}
