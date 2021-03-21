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
  path: Array<string>,
  getPath: () => Array<string>
}

interface batch extends Set<Function> {}

export interface batchInfoArray extends Array<batchInfo> {}

// subscriptions ------------------------
export interface subscriptions {
  [ITSELF]: Set<Function>,
  [key: string]: subscriptions
}

// string ------------------------
export interface path extends Array<string> {}

// attribute -----------------------------
export type attribute = [any, string, any]

export type attributes = Array<attribute>

// placeholder --------------------------
export interface placeholder {
  type: number, // @todo use enum instead
  getValue?: (compNode: compNode) => any,
  deps?: Array<path>,
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
export interface parsedInfo {
  attributes?: attributes,
  isComp?: boolean,
  name?: string,
  conditionType?: string,
  condition?: placeholder,
  enter?: string | null,
  exit?: string | null,
  group?: Array<compNode>,
  groupDeps?: Array<path>,
  anchorNode?: Comment,
  placeholder?: placeholder,
  for?: forInfo
}

export interface parsedText extends Text {
  [PARSED]?: parsedInfo
}

export interface connectionProps {
  subscribers: Array<Function>,
  unsubscribers: Array<Function>,
  [IS_SUBSCRIBED]: boolean,
  [IS_PROCESSED]: boolean,
}

export interface parsedElement extends HTMLElement, connectionProps {
  [PARSED]: parsedInfo,
}

export interface parsedNode extends Node, connectionProps {
  [PARSED]: parsedInfo,
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
  refs: Record<string, HTMLElement>,
  closure?: compNode,
  fn: Record<string, Function>,
  $: Record<string, any>,

  [PARSED]: parsedInfo,
  [SUBSCRIPTIONS]: subscriptions,
  [BEFORE_DOM_BATCH]: batch,
  [DOM_BATCH]: batch,
  [BATCH_INFO]: batchInfoArray,
  [DEFERRED_WORK]: Array<Function>,
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
    onMutate: (cb: Function, ...slices: Array<string>) => void,
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
  comps: Array<compNode>,
  anchorNode: Comment,
  loopedComp: compNode,
  getArray: () => Array<any>,
  getClosure: (value: any, index: number) => Record<string, any>,
  getKeys: () => Array<string>,
  compNode: compNode,
  initialized: boolean
}

export interface steps {
  remove: Array<number>,
  add: Array<[number, any]>,
  swap: Array<[number, number]>
}


export type obj = Record<string, any>

export interface loopState  {
  keyHash: Record<string, any>,
  keys: Array<string>,
  values: Array<any>
}

export interface stateUpdate {
  path: path,
  newValue: any
}


type stringIndex = string
export type stateUpdates = Record< stringIndex, Array<stateUpdate> >