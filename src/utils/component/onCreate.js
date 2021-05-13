import { ITSELF } from '../../constants'
import { addHooks } from './hooks'

/**
 *
 * @param {Comp} comp
 * @param {string} compName
 */
export const construct = (comp, compName) => {

  comp.refs = {}

  comp._compName = compName
  comp._subscriptions = { [ITSELF]: new Set() }
  comp._batches = /** @type {[Set<SubCallBack>, Set<SubCallBack>]}*/([new Set(), new Set()])
  comp._mutations = []
  comp._deferredWork = []
  comp._nodesUsingLocalState = new Set()
  comp._nodesUsingClosureState = new Set()

  if (!comp._prop$) comp._prop$ = {}
  if (!comp.fn) comp.fn = comp.parent ? Object.create(comp.parent.fn) : {}

  addHooks(comp)
}
