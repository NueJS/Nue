import {
  SUBSCRIPTIONS,
  ITSELF,
  BEFORE_DOM_BATCH,
  DOM_BATCH,
  BATCH_INFO,
  DEFERRED_WORK,
  NODES_USING_STATE,
  NODES_USING_CLOSURE,
  INIT_$,
  REORDERING,
  IGNORE_DISCONNECT,
  PARSED,
  CBS,
  ON_DESTROY_CBS,
  ON_MOUNT_CBS,
  BEFORE_UPDATE_CBS,
  AFTER_UPDATE_CBS,
} from './constants'

export interface batchInfo {
  oldValue: any,
  newValue: any,
  path: Array<string>,
  getPath: () => Array<string>
}

interface batch extends Set<Function> {}

export interface batchInfoArray extends Array<batchInfo> {}

export interface subscriptions {
  [ITSELF]: Set<Function>,
  [key: string]: subscriptions
}


export interface path extends Array<string> {}

export interface attribute {
  0: any, // value
  1: string, // name
  2: any // @todo use enum here
}

export interface parsedInfo {
  type: any, // @todo use enum here
  getValue: () => any,
  deps: Array<path>,
  content: string,
  attributes?: Array<attribute>,
  isComp?: boolean,
}

export interface compNode extends HTMLElement {
  disconnectedCallback: Function,
  name: string,
  refs: Record<string, Element>,
  closure?: compNode,
  fn: Record<string, Function>,
  $: Object,
  [PARSED]: parsedInfo,
  [SUBSCRIPTIONS]: subscriptions,
  [BEFORE_DOM_BATCH]: batch,
  [DOM_BATCH]: batch,
  [BATCH_INFO]: batchInfoArray,
  [DEFERRED_WORK]: Array<Function>,
  [NODES_USING_STATE]: Set<Node>,
  [NODES_USING_CLOSURE]: Set<Node>,
  [INIT_$]: Object,
  [REORDERING]?: boolean,
  [IGNORE_DISCONNECT]?: boolean,
  [CBS]: {
    [ON_MOUNT_CBS]: Array<Function>,
    [ON_DESTROY_CBS]: Array<Function>,
    [BEFORE_UPDATE_CBS]: Array<Function>,
    [AFTER_UPDATE_CBS]: Array<Function>,
  },
  events: {
    onMount: (cb: Function) => void,
    onDestroy: (cb: Function) => void,
    onMutate: (cb: Function, ...slices: Array<string>) => void,
    beforeUpdate: (cb: Function) => void,
    afterUpdate: (cb: Function) => void
  }
}