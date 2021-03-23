export type Batch = Set<Function>

/** collection of props that a parsed HTMLElement or parsed Text should have in order to receive notifications from the state updates */
export interface ConnectionProps {
  __subscribers: Function[],
  __unsubscribers: Function[],
  __isSubscribed: boolean,
  __isProcessed: boolean,
}

export type Mutation = {
  oldValue: any,
  newValue: any,
  path: string[],
  livePath: () => string[]
}

export type StatePath = string[]

export type Config = {
  defaultStyle?: string,
}