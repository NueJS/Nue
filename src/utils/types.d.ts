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
  IS_SUBSCRIBED
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

export interface attributes extends Array<attribute> {}

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
}

export interface parsedElement extends Element, connectionProps {
  [PARSED]: parsedInfo,
}

export interface parsedNode extends Node, connectionProps {
  [PARSED]: parsedInfo,
}

export interface subscribeCallback extends Function {
  node?: Node
}

// compNode ----------------------------
export interface compNode extends HTMLElement {
  disconnectedCallback: Function,
  name: string,
  refs: Record<string, Element>,
  closure?: compNode,
  fn: Record<string, Function>,
  $: Record<string, any>,
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
  [FLUSH_SCHEDULED]: boolean,
  [PREV_OFFSET]?: {
    left: number,
    top: number
  }
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


interface loopInfo extends forInfo {
  comps: Array<compNode>,
  anchorNode: Comment,
  loopedComp: compNode,
  getArray: () => Array<any>,
  getClosure: (value: any, index: number) => Record<string, any>,
  getKeys: () => Array<string>,
  compNode: compNode
}
