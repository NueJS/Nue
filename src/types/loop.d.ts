import { Comp, LoopedComp } from './dom.d';
import { StatePath } from './others.d';

export interface UpdatedSlice {
  __path: StatePath,
  __newValue: any
}

// TODO: change this from object to an array
/** updatedSlices is an object where key is a string index and value is updatedSlice on given index  */
export type updatedSlices = Record<string, UpdatedSlice[]>

export type LoopClosure = Record<string, any>

export interface loopInfo {
  __anchor: Comment,
  __parentComp: Comp,
  __loopedComp: LoopedComp,
  __loopedCompInstances: Comp[],
  __instanciated: boolean,
  __getArray: () => any[],
  __getClosure: (value: any, index: number) => LoopClosure,
  __getKeys: () => string[],
}

