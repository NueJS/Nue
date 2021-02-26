const initNue = (node, common) => ({
  node,
  refs: {},
  subscriptions: { $: new Set() },
  fn: {},
  batches: {
    computed: new Set(),
    dom: new Set()
  },
  common,
  deferred: [],
  initState: {},
  processedNodes: new Set(),
  nodesUsingClosure: new Set()
})

export default initNue
