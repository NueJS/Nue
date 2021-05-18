interface IfComp extends Comp {
	_parsedInfo: IfComp_ParseInfo;
}

interface ElseComp extends Comp {
	_parsedInfo: ElseComp_ParseInfo;
}

interface ElseIfComp extends Comp {
	_parsedInfo: ElseIfComp_ParseInfo;
}

type ConditionalComp = IfComp | ElseComp | ElseIfComp;
