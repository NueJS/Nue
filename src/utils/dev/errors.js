import err from './error'

export default {
  TEXTNODE_DIRECT_CHILD_OF_IF (comp, node) {
    err({
      message: "TEXT_NODE can't be direct child in <if>",
      fix: 'Wrap the TEXT_NODE inside <span>',
      comp,
      node
    })
  },

  // RENDER_CALLED_BEFORE_DEFINE (name) {
  //   err({
  //     message: `Tried to render <${name}> before it is defined`,
  //     fix: `define the component first using defineComponents({ ... }) and then call render("${name}")`
  //   })
  // },

  COMPONENT_ALREADY_RENDERED (name) {
    err({
      message: `<${name}> is rendered already, no need to call render("${name}") again`,
      fix: `remove the extra call to render("${name}")`
    })
  },

  FN_CALLED_MORE_THAN_ONCE (fnName) {
    err({
      message: `${fnName}() is called more than once, it should only be called once for the lifetime of application`,
      fix: `remove the extra calls to ${fnName}()`
    })
  },

  KEYS_ARE_NOT_UNIQUE (keys, component) {
    const nonUniqueKeys = keys.filter((key, i) => {
      return keys.indexOf(key, i) !== keys.lastIndexOf(key)
    })

    err({
      message:
      `non-unique keys used in <${component.localName}>` +
      '\n\n' +
      `keys used: ${JSON.stringify(keys, null, 2)} ` +
      '\n\n' +
      `non-unique keys: ${JSON.stringify(nonUniqueKeys, null, 2)}`,
      component,
      fix: 'All keys must be unique, change the key attribute on <for> '
    })
  },

  MISSING_DEPENDENCIES_IN_ON_MUTATE (comp) {
    err({
      message: `invalid use of on.mutate() in ${comp.localName} on.mutate expects one or more dependencies`
    })
  }
}
