import { createSubTree } from '../subscription/createSubTree'
import { addEvents } from './addEvents'

/**
 * called when comp is created (constructed)
 * @param {Comp} comp
 * @param {string} compName
 */
export const onCreate = (comp, compName) => {

  comp.refs = {}
  comp._subscribers = []

  comp._compName = compName
  comp._subscriptions = createSubTree()
  comp._batches = [new Set(), new Set()]
  comp._mutations = []
  comp._deferredWork = [] // TODO: move this to hydrate

  comp._nodesUsingLocalState = new Set()
  comp._nodesUsingNonLocalState = new Set()

  if (!comp._prop$) comp._prop$ = {}
  if (!comp.fn) comp.fn = comp.parent ? Object.create(comp.parent.fn) : {}

  addEvents(comp)
}
