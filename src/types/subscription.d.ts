import { Parsed_Text, Parsed_HTMLElement, Comp } from './dom.d';
import { Mutation } from './others.d';
import { ITSELF } from '../constants'

// subscriptions ------------------------
export interface Subscriptions {
  [ITSELF]: Set<Function>,
  [key: string]: Subscriptions
}

// string ------------------------

export interface SubCallBack  {
  (Mutations: Mutation[]) : void,
  __node?: Parsed_Text | Parsed_HTMLElement | Comp
}
