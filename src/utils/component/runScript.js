import { NO_OVERRIDE_MODE, REACTIVE_MODE } from '../constants.js'
import modes from '../reactivity/modes.js'

const runScript = (nue, script) => {
  modes[REACTIVE_MODE] = false
  modes[NO_OVERRIDE_MODE] = true
  const { $, refs, fn, node, events } = nue
  script({ $, refs, fn, node, ...events, events })
  modes[REACTIVE_MODE] = true
  modes[NO_OVERRIDE_MODE] = false
}

export default runScript
