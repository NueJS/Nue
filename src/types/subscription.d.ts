import { Parsed_Text, Parsed_HTMLElement, Comp } from './dom.d';
import { Mutation } from './others.d';
import { ITSELF } from '../constants'

export interface Subscriptions {
  [ITSELF]: Set<Function>,
  [key: string]: Subscriptions
}

export interface SubCallBack  {
  (Mutations?: Mutation[]) : void,
  _node?: Parsed_Text | Parsed_HTMLElement | Comp
}
