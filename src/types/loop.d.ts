import { Comp, LoopedComp } from './dom.d';
import { StatePath } from './others.d';
import { AnimationAttributes_ParseInfo, LoopAttributes } from './parsed';

export interface UpdatedSlice {
  _path: StatePath,
  _newValue: any
}

// TODO: change this from object to an array
/** updatedSlices is an object where key is a string index and value is updatedSlice on given index  */
export type updatedSlices = Record<string, UpdatedSlice[]>

export type LoopClosure = Record<string, any>

export interface LoopInfo {
  _anchor: Comment,
  _parentComp: Comp,
  _loopedComp: LoopedComp,
  _loopedCompInstances: LoopedComp[],
  _loopAttributes: LoopAttributes,
  _instanciated: boolean,
  _getArray: () => any[],
  _getClosure: (value: any, index: number) => LoopClosure,
  _getKeys: () => string[],
  _animation: AnimationAttributes_ParseInfo
}

