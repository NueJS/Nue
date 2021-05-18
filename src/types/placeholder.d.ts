interface Placeholder {
	_type: 0 | 1;
	_getValue: (comp: Comp) => any;
	_statePaths: StatePath[];
	_content: string;
	_text: string;
}

type SplitPart = Placeholder | string;
