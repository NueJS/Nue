import { StatePath } from './others.d';
import { Comp, ElseComp, IfComp, ElseIfComp } from './dom.d';
import { Placeholder } from './placeholder';

export type Attribute_ParseInfo = {
  _placeholder: Placeholder | string,
  _name: string,
  _type: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
}

interface AnimationAttributes_ParseInfo {
  _enter: string | null,
  _exit: string | null,
  _move: string | null
}

export interface Text_ParseInfo {
  _placeholder: Placeholder
}

export interface HTMLElement_ParseInfo {
  _attributes: Attribute_ParseInfo[]
}

export interface Comp_ParseInfo {
  _isComp: boolean,
  _compName: string,
  _attributes: Attribute_ParseInfo[],
}

export interface LoopedComp_ParseInfo extends Comp_ParseInfo {
  _attributes: Attribute_ParseInfo[],
  _animationAttributes: AnimationAttributes_ParseInfo,
  _loopAttributes: {
    _itemArray: Placeholder,
    _item: string,
    _itemIndex?: string,
    _key: Placeholder
  }
}
/** parsed object type of the component element that has either *else-if or *else attribute */
interface ConditionalComp_ParseInfo extends Comp_ParseInfo {
  _animationAttributes: AnimationAttributes_ParseInfo,
  _conditionType: 0 | 1 | 2,
}

/** parsed object type of the component element with *if attribute */
export interface IfComp_ParseInfo extends ConditionalComp_ParseInfo {
  _conditionAttribute: Placeholder,
  _conditionGroup: (IfComp | ElseComp | ElseIfComp)[],
  _conditionGroupStateDeps: StatePath[],
}

/** parsed object type of the component element with *else attribute */
export interface ElseComp_ParseInfo extends ConditionalComp_ParseInfo {}

/** parsed object type of the component element with *else-if attribute */
export interface ElseIfComp_ParseInfo extends IfComp_ParseInfo {}