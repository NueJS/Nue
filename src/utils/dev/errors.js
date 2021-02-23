import { lower } from '../others'

const getNodeName = (node) => `<${lower(node.nodeName)}>`
export default {

  STATE_NOT_FOUND (compName, content) {
    return {
      message: `Could not find value of [${content}]`,
      fix: `Make sure [${content}] is available in state or it's closure`,
      compName
    }
  },

  KEYS_ARE_NOT_UNIQUE (compName, keys) {
    const toJSON = v => JSON.stringify(v)
    const nonUniqueKeys = keys.filter((key, i) => {
      return keys.indexOf(key, i) !== keys.lastIndexOf(key)
    })

    const _keys = keys.map(toJSON).join(', ')
    const _nonUniqueKeys = nonUniqueKeys.map(toJSON).join(', ')
    const _s = nonUniqueKeys.length > 1 ? 's' : ''

    const message = `non-unique key${_s} used in <${compName}>` +
    '\n\n' +
    `keys used: \n${_keys} ` +
    '\n\n' +
    `non-unique key${_s}: ${_nonUniqueKeys}`

    return {
      message,
      compName,
      fix: 'make sure that all keys are unique'
    }
  },

  KEY_NOT_BRACKETED (compName, node, key) {
    const nodeName = getNodeName(node)
    return {
      message: `"Key" attribute on ${nodeName} is hard-coded`,
      fix: 'make sure you are using a bracket [] on "key" attribute\'s value so that it is not hard-coded value but a placeholder',
      compName
    }
  },

  MISSING_DEPENDENCIES_IN_ON_MUTATE (compName) {
    return {
      message: 'Missing dependencies in onMutate()',
      fix: 'onMutate expects one or more dependencies.\nExample: onMutate(countChanged, \'count\')',
      compName
    }
  },

  INVALID_FOR_ATTRIBUTE (compName, node) {
    const nodeName = getNodeName(node)
    return {
      message: `Invalid for attribute value on ${nodeName}`,
      fix: 'make sure you are following the pattern:\nfor=\'(item, index) in items\'\nor\nfor=\'item in items\'',
      compName
    }
  },

  EXIT_ANIMATION_NOT_FOUND (compName, animationName, node) {
    return {
      message: `exit animation: "${animationName}" used on <${node.parsed.name}> but not defined in CSS. \nThis will result in component never being removed, as nue.js keeps waiting for the animation to end which does not exist`,
      fix: `To fix this: define animation "${animationName}" in CSS using @keyframes`,
      compName
    }
  },

  MISSING_KEY_ATTRIBUTE (compName, node) {
    const loopCompName = node.nue.name
    return {
      message: `Missing "key" attribute on <${loopCompName}>`,
      fix: `<${loopCompName}> is looped and needs a key attribute for efficient reconciliation`,
      compName
    }
  },

  METHOD_NOT_FOUND (compName, fnName) {
    return {
      message: `invalid method "${fnName}" used`,
      fix: `Make sure that "${fnName}" is defined in the fn or it's parent fn`,
      compName
    }
  },

  RESERVED_ATTRIBUTE_USED_ON_NON_COMPONENT (compName, node, attributeName) {
    const nodeName = getNodeName(node)
    return {
      message: `"${attributeName}" attribute can only be used on a nue component, but is used on a non-component node ${nodeName}`,
      fix: `Remove this attribute if ${nodeName} is not a component. \nIf ${nodeName} is actually a nue component, make sure you have added it in ${compName}.uses array so that it can be parsed as a nue component`,
      compName
    }
  }

}
