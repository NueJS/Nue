interface CompDef {
  html: string,
  css?: string,
  js?: (comp: Comp) => void,
  components?: NueComp[],
  _compName: string,
  _elName: string,
  _template: HTMLTemplateElement,
  _class: NueComp,
  _children: Record<string, string>
}

interface NueComp {
  name: string,
  new() : CompDef
}