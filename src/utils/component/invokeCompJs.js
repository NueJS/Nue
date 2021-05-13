import { modes } from '../reactivity/modes.js'

/**
 * invoke compJs with comp instance
 * @param {CompDef['js']} compJs
 * @param {Comp} comp
 */
export const invokeCompJs = (compJs, comp) => {

  modes._reactive = false
  modes._noOverride = true

  // @ts-expect-error
  compJs(comp)

  modes._reactive = true
  modes._noOverride = false
}
