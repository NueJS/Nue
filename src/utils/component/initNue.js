import { BEFORE_DOM_BATCH, DOM_BATCH } from '../constants'

const initNue = (node, common) => ({
  node,
  refs: {},
  subscriptions: { $: new Set() },
  fn: {},
  batches: {
    [BEFORE_DOM_BATCH]: new Set(),
    [DOM_BATCH]: new Set()
  },
  batchInfo: [],
  common,
  deferred: [],
  initState: {},
  processedNodes: new Set(),
  nodesUsingClosure: new Set()
})

export default initNue
