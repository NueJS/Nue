type Attribute_ParseInfo = {
	_placeholder: Placeholder | string;
	_name: string;
	_type: AttributeType;
};

interface AnimationAttributes_ParseInfo {
	_enter: string | null;
	_exit: string | null;
	_move: string | null;
}

interface Text_ParseInfo {
	_placeholder: Placeholder;
}

interface HTMLElement_ParseInfo {
	_attributes: Attribute_ParseInfo[];
}

interface Comp_ParseInfo {
	_isComp: boolean;
	_compName: string;
	_attributes: Attribute_ParseInfo[];
}

interface LoopedComp_ParseInfo extends Comp_ParseInfo {
	_attributes: Attribute_ParseInfo[];
	_animationAttributes: AnimationAttributes_ParseInfo;
	_loopAttributes: LoopAttributes;
}

/** parsed object type of the component element that has either *else-if or *else attribute */
interface ConditionalComp_ParseInfo extends Comp_ParseInfo {
	_animationAttributes: AnimationAttributes_ParseInfo;
	_conditionType: ConditionAttribute;
}

/** parsed object type of the component element with *if attribute */
interface IfComp_ParseInfo extends ConditionalComp_ParseInfo {
	_conditionAttribute: Placeholder;
	_conditionGroup: (IfComp | ElseComp | ElseIfComp)[];
	_conditionGroupStateDeps: StatePath[];
	_conditionGroupAnchor: Comment;
}

/** parsed object type of the component element with *else attribute */
interface ElseComp_ParseInfo extends ConditionalComp_ParseInfo {}

/** parsed object type of the component element with *else-if attribute */
interface ElseIfComp_ParseInfo extends IfComp_ParseInfo {}