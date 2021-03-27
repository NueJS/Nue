interface UpdatedSlice {
  _path: StatePath,
  _newValue: any
}

// TODO: change this from object to an array
/** updatedSlices is an object where key is a string index and value is updatedSlice on given index  */
type UpdatedSlices = Record<string, UpdatedSlice[]>

type LoopClosure = Record<string, any>

interface LoopInfo {
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