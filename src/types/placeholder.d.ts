
interface Placeholder {
  _type: 0 | 1,
  _getValue: ($: Record<string, any>, compName: string) => any,
  _stateDeps: StatePath[],
  _content: string
}


type SplitPart = Placeholder | string