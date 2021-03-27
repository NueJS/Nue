/** parsed object type of the component element that has either *else-if or *else attribute */
interface ConditionalComp_ParseInfo extends Comp_ParseInfo {
  _animationAttributes: AnimationAttributes_ParseInfo,
  _conditionType: ConditionAttribute,
}

/** parsed object type of the component element with *if attribute */
interface IfComp_ParseInfo extends ConditionalComp_ParseInfo {
  _conditionAttribute: Placeholder,
  _conditionGroup: (IfComp | ElseComp | ElseIfComp)[],
  _conditionGroupStateDeps: StatePath[][],
  _conditionGroupAnchor: Comment
}

/** parsed object type of the component element with *else attribute */
interface ElseComp_ParseInfo extends ConditionalComp_ParseInfo {}

/** parsed object type of the component element with *else-if attribute */
interface ElseIfComp_ParseInfo extends IfComp_ParseInfo {}


interface IfComp extends Comp {
  _parsedInfo: IfComp_ParseInfo
}

interface ElseComp extends Comp {
  _parsedInfo: ElseComp_ParseInfo
}

interface ElseIfComp extends Comp {
  _parsedInfo: ElseIfComp_ParseInfo
}


type ConditionalComp = IfComp | ElseComp | ElseIfComp