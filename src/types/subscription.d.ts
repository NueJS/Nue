// commented out stuff is actually being used, but I can't import ITSELF symbol in this file
// because then these types will be be globally available - this sucks !
interface Subscriptions {
  // [ITSELF]: Set<Function>,
  [key: string]: Subscriptions
}

interface SubCallBack  {
  (Mutations: Mutation[]) : void,
  _node?: Parsed_Text | Parsed_HTMLElement | Comp
}
