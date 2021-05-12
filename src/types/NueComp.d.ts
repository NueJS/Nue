interface CompDef {
  html: string,
  css?: string,
  js?: (comp: Comp) => void,
  uses?: NueComp[],
  _compName: string,
  _template: HTMLTemplateElement,
  _class: NueComp,
  _children: Record<string, string>
}

interface NueComp {
  name: string,
  new() : CompDef
}