type AttributeType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

type ConditionAttribute = '*if' | '*else-if' | '*else';

interface LoopAttributes {
	_itemArray: Placeholder;
	_item: string;
	_itemIndex?: string;
	_key: Placeholder;
}
