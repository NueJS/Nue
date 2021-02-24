const initNue = (node, common) => ({
  node,
  refs: {},
  subscribers: { $: new Map() },
  fn: {},
  queue: {
    // batched callbacks
    stateReady: new Map(),
    computed: new Map(),
    dom: new Map()
  },
  common,
  deferred: [],
  initState: {}
})

export default initNue
