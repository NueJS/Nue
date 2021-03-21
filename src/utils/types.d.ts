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
  FLUSH_SCHEDULED,
  PREV_OFFSET,
  IS_SUBSCRIBED,
  IS_PROCESSED
} from './constants'

// batch ------------------------------
export interface batchInfo {
  oldValue: any,
  newValue: any,
  path: string[],
  getPath: () => string[]
}

export type batch = Set<Function>

export type batchInfoArray = batchInfo[]

// subscriptions ------------------------
export interface subscriptions {
  [ITSELF]: Set<Function>,
  [key: string]: subscriptions
}

// string ------------------------
export type path = string[]

// attribute -----------------------------
export type attribute = [any, string, any]

export type attributes = attribute[]

// placeholder --------------------------
export interface placeholder {
  type: number, // @todo use enum instead
  getValue?: (compNode: compNode) => any,
  deps?: path[],
  content: string
}

// parsed --------------------------

export interface forInfo {
  itemArray: placeholder,
  item: string,
  itemIndex: string | undefined,
  key: placeholder,
  enter?: string | null,
  exit?: string | null,
  reorder: string | null
}
export interface Parsed {
  attributes?: attributes,
  isComp?: boolean,
  name?: string,
  conditionType?: string,
  condition?: placeholder,
  enter?: string | null,
  exit?: string | null,
  group?: compNode[],
  groupDeps?: path[],
  anchorNode?: Comment,
  placeholder?: placeholder,
  for?: forInfo
}


export interface connectionProps {
  subscribers: Function[],
  unsubscribers: Function[],
  [IS_SUBSCRIBED]?: boolean,
  [IS_PROCESSED]?: boolean,
}

export interface parsedText extends Text, connectionProps {
  [PARSED]: Parsed
}

export interface parsedElement extends HTMLElement, connectionProps {
  [PARSED]: Parsed,
}

export interface parsedNode extends Node, connectionProps {
  [PARSED]: Parsed,
}


export interface subscribeCallback  {
  (batchInfoArray: batchInfoArray) : void,
  node?: parsedNode
}

export type subscribeCallbackArray = subscribeCallback[]

// compNode ----------------------------
export interface compNode extends HTMLElement, connectionProps {
  disconnectedCallback: Function,

  name: string,
  refs: Record<string, parsedElement>,
  fn: Record<string, Function>,
  $: Record<string, any>,

  closure?: compNode,

  [PARSED]: Parsed,
  [SUBSCRIPTIONS]: subscriptions,
  [BEFORE_DOM_BATCH]: batch,
  [DOM_BATCH]: batch,
  [BATCH_INFO]: batchInfoArray,
  [DEFERRED_WORK]: Function[],
  [NODES_USING_STATE]: Set<parsedNode>,
  [NODES_USING_CLOSURE]: Set<parsedNode>,
  [INIT_$]: Record<string, any>,
  [FLUSH_SCHEDULED]: boolean,

  [CBS]: {
    [ON_MOUNT_CBS]: subscribeCallbackArray,
    [ON_DESTROY_CBS]: subscribeCallbackArray,
    [BEFORE_UPDATE_CBS]: subscribeCallbackArray,
    [AFTER_UPDATE_CBS]: subscribeCallbackArray,
  },

  events: {
    onMount: (cb: Function) => void,
    onDestroy: (cb: Function) => void,
    onMutate: (cb: Function, ...slices: string[]) => void,
    beforeUpdate: (cb: Function) => void,
    afterUpdate: (cb: Function) => void
  },

  [REORDERING]?: boolean,
  [IGNORE_DISCONNECT]?: boolean,
  [PREV_OFFSET]?: {
    left: number,
    top: number
  }
}


export interface loopInfo extends forInfo {
  comps: compNode[],
  anchorNode: Comment,
  loopedComp: compNode,
  getArray: () => any[],
  getClosure: (value: any, index: number) => Record<string, any>,
  getKeys: () => string[],
  compNode: compNode,
  initialized: boolean
}

export interface steps {
  remove: number[],
  add: [number, any][],
  swap: [number, number][]
}


export type obj = Record<string, any>

export interface loopState  {
  keyHash: Record<string, any>,
  keys: string[],
  values: any[]
}

export interface stateUpdate {
  path: path,
  newValue: any
}


type stringIndex = string
export type stateUpdates = Record< stringIndex, stateUpdate[] >