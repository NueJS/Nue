interface NueCompInstance {
  html: string,
  css?: string,
  js?: (comp: Comp) => void,
  uses?: NueComp[],
}

interface NueComp {
  name: string,
  new() : NueCompInstance
}