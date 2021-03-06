type LifeCycleHook = (cb: Function) => void;

interface Comp extends HTMLElement, NodeSubscription {
	disconnectedCallback: Function;

	/** stores elements having *ref='ref-name' attribute with "ref-name" as key and element itself as the value */
	refs: Record<string, Parsed_HTMLElement>;

	/** stores functions defined in component function */
	fn: Record<string, Function>;

	/** reactive state of component */
	$: Record<string, any>;

	/** parent component */
	parent: Comp; // root component will not have any parent

	/** object containing lifecycles hooks  */
	events: {
		onMount: LifeCycleHook;
		onDestroy: LifeCycleHook;
		beforeUpdate: LifeCycleHook;
		afterUpdate: LifeCycleHook;
		onMutate: (cb: Function, paths: string[]) => void;
	};

	/** name of the component function */
	_compName: string;

	/** information gotten by parsing the component element */
	_parsedInfo: Comp_ParseInfo;

	/** tree structure that stores the callbacks that are subscribed to certain paths of state */
	_subscriptions: Subscriptions;

	/** array of mutations that occurred in a flush */
	_mutations: Mutation[];

	/** array of functions that have to been deferred to be called later */
	_deferredWork: Function[];

	/** nodes of component that are using local state of component */
	_nodesUsingLocalState: Set<ParsedDOMNode>;

	/** nodes of component that are using non-local state */
	_nodesUsingNonLocalState: Set<ParsedDOMNode>;

	/** state that component is given from parent component */
	_prop$: Record<string, any>;

	_isLooped: boolean;

	/** indicates whether or not a "flush" is scheduled or not - a flush is process of clearing batches by invoking all the callbacks  */
	_flush_scheduled: boolean;

	/** array of batches, first one is flushed first, second one is flushed after. second batch is for callbacks that update DOM */
	_batches: [Set<Function>, Set<Function>];

	/** callbacks that are registered to be called on certain lifecycles */
	_eventCbs: {
		_onMount: Function[];
		_onDestroy: Function[];
		_beforeUpdate: Function[];
		_afterUpdate: Function[];
	};

	/** indicates whether or not the component is being moved, if it is being moved, we can ignore disconnected and connected callbacks to prevent unnecessary work  */
	_moving?: boolean;

	/** indicates whether or not disconnectedCallback was manually called already,
	 * if it has been - no need to run disconnectedCallback again,
	 * this is set when we want to perform an animated exit  */
	_manuallyDisconnected?: boolean;
}


/** Comp that is looped */
interface LoopedComp extends Comp {
	_parsedInfo: LoopedComp_ParseInfo;
	/** records the previous offset, this is set when a loopedComponent is given a move transition */
	_prevOffset?: Offset;
}