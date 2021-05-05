interface CompArgs {
  html: Function,
  css: Function,
  components: Function,
  $: Comp['$'],
  fn: Comp['fn'],
  refs: Comp['refs'],
  hooks: Comp['hooks'],
}

type CompFn = (compArgs: CompArgs) => void