/** Text node that has been parsed */
interface Parsed_Text extends Text, NodeSubscription {
	_parsedInfo: Text_ParseInfo;
}

/** HTMLElement that has been parsed */
interface Parsed_HTMLElement extends HTMLElement, NodeSubscription {
	_parsedInfo: HTMLElement_ParseInfo;
}

/** any type of parsed DOM node */
type ParsedDOMNode = Parsed_Text | Parsed_HTMLElement | Comp | ConditionalComp;
