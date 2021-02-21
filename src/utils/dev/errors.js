export default {

  STATE_NOT_FOUND (comp, content) {
    return {
      message: `Could not find value of [${content}]`,
      fix: `Make sure [${content}] is available in state or it's closure`,
      comp
    }
  },

  KEYS_ARE_NOT_UNIQUE (keys, comp) {
    const nonUniqueKeys = keys.filter((key, i) => {
      return keys.indexOf(key, i) !== keys.lastIndexOf(key)
    })

    const compName = comp.name
    const message = `non-unique keys used in <${compName}>` +
    '\n' +
    `keys used: ${keys} ` +
    '\n' +
    `non-unique keys: ${nonUniqueKeys}`

    return {
      message,
      comp,
      fix: 'make sure that key used in <for> is unique for all items'
    }
  },

  MISSING_DEPENDENCIES_IN_ON_MUTATE (comp) {
    return {
      message: `invalid use of on.mutate() in ${comp.name} on.mutate expects one or more dependencies`
    }
  }
}
