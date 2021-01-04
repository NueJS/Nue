import err from './error'

export default {
  TEXTNODE_DIRECT_CHILD_OF_IF (comp) {
    err({
      comp,
      message: 'TEXT_NODE can\'t be direct child of <if>, \nwrap it inside <span>.'
    })
  },

  RENDER_CALLED_BEFORE_DEFINE (name) {
    err({
      message: `Tried to render <${name}> before it is defined. \ndefine({ ... }) first and then call render("${name}")`
    })
  },

  COMPONENT_ALREADY_RENDERED (name) {
    err({
      message: `<${name}> is already rendered. - you tried to render it again`
    })
  },

  FN_CALLED_MORE_THAN_ONCE (fnName) {
    err({
      message: `${fnName}() is called more than once. - it should only be called once`
    })
  },

  KEYS_ARE_NOT_UNIQUE (keys, component) {
    const nonUniqueKeys = keys.filter((key, i) => {
      return keys.indexOf(key, i) !== keys.lastIndexOf(key)
    })

    err({
      message:
      `non-unique keys used in <${component.localName}> component ` +
      '\n\n' +
      `keys used: ${JSON.stringify(keys, null, 2)} ` +
      '\n\n' +
      `non-unique keys: ${JSON.stringify(nonUniqueKeys, null, 2)}`
    })
  }
}
