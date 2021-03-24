import { ConnectionProps, Mutation } from './others.d';
import { Comp_ParseInfo, LoopedComp_ParseInfo, IfComp_ParseInfo, ElseComp_ParseInfo, ElseIfComp_ParseInfo, HTMLElement_ParseInfo, Text_ParseInfo } from './parsed.d';
import { Subscriptions } from './subscription.d';

// node, element types

/** Text node that has been parsed */
export interface Parsed_Text extends Text, ConnectionProps {
  _parsedInfo: Text_ParseInfo
}

/** HTMLElement that has been parsed */
export interface Parsed_HTMLElement extends HTMLElement, ConnectionProps {
  _parsedInfo: HTMLElement_ParseInfo
}

// component types

type LifeCycleHook = (cb: Function) => void
type NodeSet = Set<Parsed_Text | Parsed_HTMLElement>

export interface Comp extends HTMLElement, ConnectionProps {
  disconnectedCallback: Function,

  /** stores elements having *ref='ref-name' attribute with "ref-name" as key and element itself as the value */
  refs: Record<string, Parsed_HTMLElement>,

  /** stores functions defined in component function */
  fn: Record<string, Function>,

  /** reactive state of component */
  $: Record<string, any>,

  /** parent component */
  parent: Comp, // root component will not have any parent

  /** object containing lifecycles hooks  */
  hooks: {
    onMount: LifeCycleHook,
    onDestroy: LifeCycleHook,
    beforeUpdate: LifeCycleHook,
    afterUpdate: LifeCycleHook
    onMutate: (cb: Function, ...paths: string[]) => void,
  },

  /** name of the component function */
  _compFnName: string,

  /** information gotten by parsing the component element */
  _parsedInfo: Comp_ParseInfo,

  /** tree structure that stores the callbacks that are subscribed to certain paths of state */
  _subscriptions: Subscriptions,

  /** array of mutations that occurred in a flush */
  _mutations: Mutation[],

  /** array of functions that have to been deferred to be called later */
  _deferredWork: Function[],

  /** nodes of component that are using local state of component */
  _nodesUsingLocalState: NodeSet,

  /** nodes of component that are using non-local state */
  _nodesUsingClosureState: NodeSet,

  /** state that component is given from parent component */
  _prop$: Record<string, any>,

  /** indicates whether or not a "flush" is scheduled or not - a flush is process of clearing batches by invoking all the callbacks  */
  _flush_scheduled: boolean,

  /** array of batches, first one is flushed first, second one is flushed after. second batch is for callbacks that update DOM */
  _batches: [Set<Function>, Set<Function>],

  /** callbacks that are registered to be called on certain lifecycles */
  _hookCbs: {
    _onMount: Function[],
    _onDestroy: Function[],
    _beforeUpdate: Function[],
    _afterUpdate: Function[],
  }

  /** indicates whether or not the component is being moved, if it is being moved, we can ignore disconnected and connected callbacks to prevent unnecessary work  */
  _moving?: boolean,

  /** indicates whether or not disconnectedCallback was manually called already,
   * if it has been - no need to run disconnectedCallback again,
   * this is set when we want to perform an animated exit  */
  _manuallyDisconnected?: boolean,

  /** records the previous offset, this is set when a loopedComponent is given a move transition */
  _prevOffset?: {
    _left: number,
    _top: number
  }
}


export interface LoopedComp extends Comp {
  _parsedInfo: LoopedComp_ParseInfo
}

export interface IfComp extends Comp {
  _parsedInfo: IfComp_ParseInfo
}

export interface ElseComp extends Comp {
  _parsedInfo: ElseComp_ParseInfo
}

export interface ElseIfComp extends Comp {
  _parsedInfo: ElseIfComp_ParseInfo
}

export type ConditionalComp = IfComp | ElseComp | ElseIfComp

export type ParsedDOMElement = Parsed_Text | Parsed_HTMLElement | Comp