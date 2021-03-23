import { ConnectionProps, Mutation } from './others.d';
import { Comp_ParseInfo, LoopedComp_ParseInfo, IfComp_ParseInfo, ElseComp_ParseInfo, ElseIfComp_ParseInfo, HTMLElement_ParseInfo, Text_ParseInfo } from './parsed.d';
import { SubCallBack, Subscriptions } from './subscription.d';

// node, element types

/** Text node that has been parsed */
export interface Parsed_Text extends Text, ConnectionProps {
  __parsedInfo: Text_ParseInfo
}

/** HTMLElement that has been parsed */
export interface Parsed_HTMLElement extends HTMLElement, ConnectionProps {
  __parsedInfo: HTMLElement_ParseInfo
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
  parent: Comp | undefined, // root component will not have any parent

  /** object containing lifecycles hooks  */
  hooks: {
    onMount: LifeCycleHook,
    onDestroy: LifeCycleHook,
    beforeUpdate: LifeCycleHook,
    afterUpdate: LifeCycleHook
    onMutate: (cb: Function, ...paths: string[]) => void,
  },

  /** name of the component function */
  __compFnName: string,

  /** information gotten by parsing the component element */
  __parsedInfo: Comp_ParseInfo,

  /** tree structure that stores the callbacks that are subscribed to certain paths of state */
  __subscriptions: Subscriptions,

  /** array of mutations that occurred in a flush */
  __mutations: Mutation[],

  /** array of functions that have to been deferred to be called later */
  __deferredWork: Function[],

  /** nodes of component that are using local state of component */
  __nodesUsingLocalState: NodeSet,

  /** nodes of component that are using non-local state */
  __nodesUsingClosureState: NodeSet,

  /** state that component is given from parent component */
  __prop$: Record<string, any>,

  /** indicates whether or not a "flush" is scheduled or not - a flush is process of clearing batches by invoking all the callbacks  */
  __flush_scheduled: boolean,

  /** array of batches, first one is flushed first, second one is flushed after. second batch is for callbacks that update DOM */
  __batches: [Set<Function>, Set<Function>],

  /** callbacks that are registered to be called on certain lifecycles */
  __lifecycleCallbacks: {
    __onMount: SubCallBack[],
    __onDestroy: SubCallBack[],
    __beforeUpdate: SubCallBack[],
    __afterUpdate: SubCallBack[],
  }

  /** indicates whether or not the component is being moved, if it is being moved, we can ignore disconnected and connected callbacks to prevent unnecessary work  */
  __moving?: boolean,

  /** indicates whether or not disconnectedCallback was manually called already,
   * if it has been - no need to run disconnectedCallback again,
   * this is set when we want to perform an animated exit  */
  __manuallyDisconnected?: boolean,

  /** records the previous offset, this is set when a loopedComponent is given a move transition */
  __prevOffset?: {
    __left: number,
    __top: number
  }
}


export interface LoopedComp extends Comp {
  __parsedInfo: LoopedComp_ParseInfo
}

export interface IfComp extends Comp {
  __parsedInfo: IfComp_ParseInfo
}

export interface ElseComp extends Comp {
  __parsedInfo: ElseComp_ParseInfo
}

export interface ElseIfComp extends Comp {
  __parsedInfo: ElseIfComp_ParseInfo
}

export type ConditionalComp = IfComp | ElseComp | ElseIfComp

export type ParsedDOMElement = Parsed_Text | Parsed_HTMLElement | Comp