
interface Placeholder {
  _type: 0 | 1,
  _getValue: (comp: Comp) => any,
  _stateDeps: StatePath[],
  _content: string
}


type SplitPart = Placeholder | string