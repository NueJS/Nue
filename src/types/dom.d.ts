/** Text node that has been parsed */
interface Parsed_Text extends Text, ConnectionProps {
  _parsedInfo: Text_ParseInfo
}

/** HTMLElement that has been parsed */
interface Parsed_HTMLElement extends HTMLElement, ConnectionProps {
  _parsedInfo: HTMLElement_ParseInfo
}

interface LoopedComp extends Comp {
  _parsedInfo: LoopedComp_ParseInfo,
  /** records the previous offset, this is set when a loopedComponent is given a move transition */
  _prevOffset?: Offset
}


type ParsedDOMElement = Parsed_Text | Parsed_HTMLElement | Comp | IfComp | ElseComp | ElseIfComp