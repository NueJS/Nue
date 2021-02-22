export default {

  STATE_NOT_FOUND (nue, content) {
    return {
      message: `Could not find value of [${content}]`,
      fix: `Make sure [${content}] is available in state or it's closure`,
      nue
    }
  },

  KEYS_ARE_NOT_UNIQUE (keys, nue) {
    const nonUniqueKeys = keys.filter((key, i) => {
      return keys.indexOf(key, i) !== keys.lastIndexOf(key)
    })

    const compName = nue.name
    const message = `non-unique keys used in <${compName}>` +
    '\n' +
    `keys used: ${keys} ` +
    '\n' +
    `non-unique keys: ${nonUniqueKeys}`

    return {
      message,
      nue,
      fix: 'make sure that key used in <for> is unique for all items'
    }
  },

  MISSING_DEPENDENCIES_IN_ON_MUTATE (nue) {
    return {
      message: `invalid use of on.mutate() in ${nue.name} on.mutate expects one or more dependencies`
    }
  },

  INVALID_FOR_ATTRIBUTE (nue, node) {
    return {
      message: `Invalid for attribute value on ${node.nodeName}`,
      fix: 'make sure you are following the pattern:\nfor=\'(item, index) in items\'\nor\nfor=\'item in items\'',
      nue
    }
  },

  EXIT_ANIMATION_NOT_FOUND (nue, animationName, node) {
    return {
      message: `exit animation: "${animationName}" used on <${node.parsed.name}> but not defined in CSS. \nThis will result in component never being removed, as nue.js keeps waiting for the animation to end which does not exist`,
      fix: `To fix this: define animation "${animationName}" in CSS using @keyframes`,
      nue,
      code: 'MISSING_EXIT_ANIMATION_IN_CSS'
    }
  },

  MISSING_KEY_ATTRIBUTE (nue, node) {
    return {
      message: `missing attribute "key" on ${node.nodeName}.`,
      nue
    }
  },

  METHOD_NOT_FOUND (nue, fnName) {
    throw {
      message: `invalid method "${fnName}" used`,
      link: '',
      code: -1,
      nue
    }
  }
}
