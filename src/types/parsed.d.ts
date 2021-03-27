type AttributeType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7

type ConditionAttribute = '*if' | '*else-if' | '*else'

type Attribute_ParseInfo = {
  _placeholder: Placeholder | string,
  _name: string,
  _type: AttributeType
}

interface AnimationAttributes_ParseInfo {
  _enter: string | null,
  _exit: string | null,
  _move: string | null
}

interface Text_ParseInfo {
  _placeholder: Placeholder
}

interface HTMLElement_ParseInfo {
  _attributes: Attribute_ParseInfo[]
}

interface Comp_ParseInfo {
  _isComp: boolean,
  _compName: string,
  _attributes: Attribute_ParseInfo[],
}

interface LoopAttributes {
  _itemArray: Placeholder,
  _item: string,
  _itemIndex?: string,
  _key: Placeholder
}

interface LoopedComp_ParseInfo extends Comp_ParseInfo {
  _attributes: Attribute_ParseInfo[],
  _animationAttributes: AnimationAttributes_ParseInfo,
  _loopAttributes: LoopAttributes
}