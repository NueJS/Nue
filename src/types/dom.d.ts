import { Placeholder } from './placeholder.d';
import { Batch, ConnectionProps, Mutation } from './others.d';
import { Comp_ParseInfo, LoopedComp_ParseInfo, IfComp_ParseInfo, ElseComp_ParseInfo, ElseIfComp_ParseInfo, Attribute_ParseInfo } from './parsed.d';
import { SubCallBack, Subscriptions } from './subscription.d';

// node, element types

/** Text node that has been parsed */
export interface Parsed_Text extends Text, ConnectionProps {
  __parsedInfo: {
    __placeholder: Placeholder
  }
}

/** HTMLElement that has been parsed */
export interface Parsed_HTMLElement extends HTMLElement, ConnectionProps {
  __parsedInfo: {
    __attributes: Attribute_ParseInfo[]
  }
}

// component types

type LifeCycleHook = (cb: Function) => void
type NodeSet = Set<Parsed_Text | Parsed_HTMLElement>

export interface Comp extends HTMLElement, ConnectionProps {
  disconnectedCallback: Function,

  refs: Record<string, Parsed_HTMLElement>,
  fn: Record<string, Function>,
  $: Record<string, any>,
  parent: Comp | undefined, // root component will not have any parent

  events: {
    onMount: LifeCycleHook,
    onDestroy: LifeCycleHook,
    onMutate: (cb: Function, ...paths: string[]) => void,
    beforeUpdate: LifeCycleHook,
    afterUpdate: LifeCycleHook
  },

  __compName: string,
  __parsedInfo: Comp_ParseInfo,
  __subscriptions: Subscriptions,
  __mutations: Mutation[],
  __deferredWork: Function[],
  __nodesUsingState: NodeSet,
  __nodesUsingClosure: NodeSet,
  __initial$: Record<string, any>,
  __flush_scheduled: boolean,
  __batches: Batch[]
  __lifecycleCallbacks: {
    __onMount: SubCallBack[],
    __onDestroy: SubCallBack[],
    __beforeUpdate: SubCallBack[],
    __afterUpdate: SubCallBack[],
  }

  __reordering?: boolean,
  __ignoreDisconnect?: boolean,
  __prevOffset?: {
    left: number,
    top: number
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

export type ParsedDOMElement = Parsed_Text | Parsed_HTMLElement | Comp