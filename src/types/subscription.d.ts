interface Subscriptions {
  _itself: Set<Function>,
  [key: string]: Subscriptions | Set<Function>
}

interface SubCallBack  {
  (Mutations: Mutation[]) : void,
  _node?: Parsed_Text | Parsed_HTMLElement | Comp
}
