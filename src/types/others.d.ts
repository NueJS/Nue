type Batch = Set<Function>;

type Mutation = {
	oldValue: any;
	newValue: any;
	path: string[];
	livePath: () => string[];
};

type BatchCallBack = {
	(mutations: Mutation[]) : void
}

type StatePath = string[];

type Config = {
	defaultCSS?: string;
	nodeUpdated?: (node: Node) => void;
};

type Offset = {
	_left: number;
	_top: number;
};

interface NueError extends Error {
	issue: string;
	fix: string;
	code: HTMLElement;
}

type State = Record<string, any>;
