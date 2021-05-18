// commented out stuff is actually being used, but I can't import ITSELF symbol in this file
// because then these types will be be globally available - this sucks !
interface Subscriptions {
	// [ITSELF]: Set<Function>,
	[key: string]: Subscriptions;
}

/**
 * unsubscriber is a function which when called unsubscribes the node from the state so that when
 * the state is updated, node is no longer updated
 *
 * unsubscriber is called when a node is removed from the dom
 *
 * unsubscriber is created and returned by calling a subscriber
 */
type Unsubscriber = () => void;

/**
 * subscriber is a function which when called,
 * immediately updates it using the state and subscribes it to state to keep in sync with the state
 * and returns a unsubscriber function which when called unsubscribes the node from the state
 */
type Subscriber = () => Unsubscriber;

/** properties that ParsedDOMNode have */
interface NodeSubscription {
	_subscribers: Subscriber[];
	_unsubscribers: Unsubscriber[];
	_isSubscribed: boolean;
	_isProcessed: boolean;
}
