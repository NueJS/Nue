const initNue = (node, common) => ({
  node,
  refs: {},
  subscribers: { $: new Set() },
  fn: {},
  queue: {
    // batched callbacks
    computed: new Map(),
    dom: new Map()
  },
  common,
  deferred: [],
  initState: {}
})

export default initNue
