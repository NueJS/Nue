 type Batch = Set<Function>

/** collection of props that a parsed HTMLElement or parsed Text should have in order to receive notifications from the state updates */
 interface ConnectionProps {
  _subscribers: Function[],
  _unsubscribers: Function[],
  _isSubscribed: boolean,
  _isProcessed: boolean,
}

 type Mutation = {
  oldValue: any,
  newValue: any,
  path: string[],
  livePath: () => string[]
}

 type StatePath = string[]

 type Config = {
  defaultStyle?: string,
}

 type Offset = {
  _left: number,
  _top: number
}

type NueError = {
  message: string,
  fix: string,
  compName: string
}