import { Comp } from './dom';
import { StatePath } from './others';

export interface Placeholder {
  _type: 0 | 1,
  _getValue: (compElement: Comp) => any,
  _stateDeps: StatePath[],
  _content: string
}
