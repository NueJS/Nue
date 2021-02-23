const initNue = (node, common) => ({
  node,
  refs: {},
  deps: { $: new Map() },
  fn: {},
  queue: {
    // batched callbacks
    stateReady: new Map(),
    computed: new Map(),
    dom: new Map()
  },
  common,
  deferred: [],
  initState: {},
  reordering: false
})

export default initNue
