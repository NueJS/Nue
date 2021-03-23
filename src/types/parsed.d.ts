import { StatePath } from './others.d';
import { Comp, ElseComp, IfComp, ElseIfComp } from './dom.d';
import { Placeholder } from './placeholder';

export type Attribute_ParseInfo = [
  attributeValue: any,
  attributeName: string,
  attributeType: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
]

interface AnimationAttributes_ParseInfo {
  __enter: string | null,
  __exit: string | null,
  __reorder: string | null
}

export interface Text_ParseInfo {
  __placeholder: Placeholder
}

export interface HTMLElement_ParseInfo {
  __attributes: Attribute_ParseInfo[]
}

export interface Comp_ParseInfo {
  __isComp: boolean,
  __compName: string,
  __attributes: Attribute_ParseInfo[],
}

export interface LoopedComp_ParseInfo extends Comp_ParseInfo {
  __attributes: Attribute_ParseInfo[],
  __animationAttributes: AnimationAttributes_ParseInfo,
  __loopAttributes: {
    __itemArray: Placeholder,
    __item: string,
    __itemIndex?: string,
    __key: Placeholder
  }
}
/** parsed object type of the component element that has either *else-if or *else attribute */
interface ConditionalComp_ParseInfo extends Comp_ParseInfo {
  __animationAttributes: AnimationAttributes_ParseInfo,
  __conditionType: 0 | 1 | 2,
}

/** parsed object type of the component element with *if attribute */
export interface IfComp_ParseInfo extends ConditionalComp_ParseInfo {
  __conditionAttribute: Placeholder,
  __conditionGroup: (IfComp | ElseComp | ElseIfComp)[],
  __conditionGroupStateDeps: StatePath[],
}

/** parsed object type of the component element with *else attribute */
export interface ElseComp_ParseInfo extends ConditionalComp_ParseInfo {}

/** parsed object type of the component element with *else-if attribute */
export interface ElseIfComp_ParseInfo extends IfComp_ParseInfo {}