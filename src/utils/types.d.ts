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
  FLUSH_SCHEDULED
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
export interface attribute {
  0: any, // value
  1: string, // name
  2: any // @todo use enum here
}

export interface attributes extends Array<attribute> {}

// placeholder --------------------------
export interface placeholder {
  type: number, // @todo use enum instead
  getValue?: () => any,
  deps?: path,
  content: string
}

// parsed --------------------------
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
  for?: {
    itemArray: placeholder,
    item: string,
    itemIndex: string | undefined,
    key: placeholder,
    enter?: string | null,
    exit?: string | null,
    reorder: string | null
  }
}

export interface parsedText extends Text {
  [PARSED]?: parsedInfo
}

export interface parsedElement extends Element {
  [PARSED]: parsedInfo
}

// compNode ----------------------------
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
  [FLUSH_SCHEDULED]: boolean,
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