export interface ReconcileState  {
  __keyHash: Record<string, any>,
  __keys: string[],
  __values: any[]
}

export interface ReconcileSteps {
  __remove: number[],
  __add: [number, any][],
  __swap: [number, number][]
}