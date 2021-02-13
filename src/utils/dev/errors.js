export default {
  TEXTNODE_DIRECT_CHILD_OF_IF (comp, node) {
    throw {
      message: "TEXT_NODE can't be direct child in <if>",
      fix: 'Wrap the TEXT_NODE inside <span>',
      comp,
      node
    }
  },

  COMPONENT_ALREADY_RENDERED (name) {
    throw {
      message: `<${name}> is rendered already, no need to call render("${name}") again`,
      fix: `remove the extra call to render("${name}")`
    }
  },

  FN_CALLED_MORE_THAN_ONCE (fnName) {
    throw {
      message: `${fnName}() is called more than once, it should only be called once for the lifetime of application`,
      fix: `remove the extra calls to ${fnName}()`
    }
  },

  KEYS_ARE_NOT_UNIQUE (keys, component) {
    const nonUniqueKeys = keys.filter((key, i) => {
      return keys.indexOf(key, i) !== keys.lastIndexOf(key)
    })

    const message = 'non-unique keys used in <for>' +
    '\n' +
    `keys used: ${keys} ` +
    '\n' +
    `non-unique keys: ${nonUniqueKeys}`

    throw {
      message,
      component,
      fix: 'make sure that key used in <for> is unique for all items'
    }
  },

  MISSING_DEPENDENCIES_IN_ON_MUTATE (comp) {
    throw {
      message: `invalid use of on.mutate() in ${comp.localName} on.mutate expects one or more dependencies`
    }
  }
}
