import { NO_OVERRIDE_MODE, REACTIVE_MODE } from '../constants.js'
import modes from '../reactivity/modes.js'

const runScript = (compNode, script) => {
  modes[REACTIVE_MODE] = false
  modes[NO_OVERRIDE_MODE] = true

  const { $, refs, fn, events } = compNode
  script({ $, refs, fn, ...events, events })

  modes[REACTIVE_MODE] = true
  modes[NO_OVERRIDE_MODE] = false
}

export default runScript
