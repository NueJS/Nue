import modes from '../reactivity/modes.js'

const runScript = (nue, script) => {
  modes.reactive = false
  modes.noOverride = true
  const { $, refs, fn, node, events } = nue
  script({ $, refs, fn, node, ...events, events })
  modes.reactive = true
  modes.noOverride = false
}

export default runScript
