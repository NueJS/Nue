import modes from './reactivity/modes.js'

const runScript = (nue, script) => {
  modes.reactive = false
  modes.noOverride = true

  script({
    $: nue.$,
    refs: nue.refs,
    fn: nue.fn,
    node: nue.node,
    ...nue.events,
    events: nue.events
  })

  modes.reactive = true
  modes.noOverride = false
}

export default runScript
