export default {

  KEYS_ARE_NOT_UNIQUE (keys, comp) {
    const nonUniqueKeys = keys.filter((key, i) => {
      return keys.indexOf(key, i) !== keys.lastIndexOf(key)
    })

    const compName = comp.memo.name
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
      message: `invalid use of on.mutate() in ${comp.memo.name} on.mutate expects one or more dependencies`
    }
  }
}
