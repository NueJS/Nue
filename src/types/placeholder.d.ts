import { Comp } from './dom';
import { StatePath } from './others';

export interface Placeholder {
  __type: 0 | 1,
  __getValue: (compElement: Comp) => any,
  __stateDeps: StatePath[],
  __content: string
}
