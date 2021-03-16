import { lower } from '../others'

/**
 * return the "<x>" for xNode
 * @param {Element} node
 * @returns {string}
 */
const getNodeName = (node) => `<${lower(node.nodeName)}>`

/** @typedef {{ message: string, fix: string, compName: string }} error */

const errors = {

  /**
   * @param {string} compName
   * @param {string} content
   * @returns {error}
   */
  STATE_NOT_FOUND (compName, content) {
    return {
      message: `Could not find value of [${content}]`,
      fix: `Make sure [${content}] is available in state or it's closure`,
      compName
    }
  },

  /**
   * @param {string} compName
   * @param {Array<string>} keys
   * @returns {error}
   */
  KEYS_ARE_NOT_UNIQUE (compName, keys) {
    /**
     * convert to json
     * @param {any} v
     * @returns {string}
     */
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

  /**
   * @param {string} compName
   * @param {Element} node
   * @returns {error}
   */
  KEY_NOT_BRACKETED (compName, node) {
    const nodeName = getNodeName(node)
    return {
      message: `"Key" attribute on ${nodeName} is hard-coded`,
      fix: 'make sure you are using a bracket [] on "key" attribute\'s value so that it is not hard-coded value but a placeholder',
      compName
    }
  },

  /**
   * @param {string} compName
   * @returns {error}
   */
  MISSING_DEPENDENCIES_IN_ON_MUTATE (compName) {
    return {
      message: 'Missing dependencies in onMutate()',
      fix: 'onMutate expects one or more dependencies.\nExample: onMutate(countChanged, \'count\')',
      compName
    }
  },

  /**
   * @param {string} compName
   * @param {Element} node
   * @returns {error}
   */
  INVALID_FOR_ATTRIBUTE (compName, node) {
    const nodeName = getNodeName(node)
    return {
      message: `Invalid for attribute value on ${nodeName}`,
      fix: 'make sure you are following the pattern:\nfor=\'(item, index) in items\'\nor\nfor=\'item in items\'',
      compName
    }
  },

  /**
   * @param {string} compName
   * @param {string} animationName
   * @param {string} loopedCompName
   * @returns {error}
   */
  EXIT_ANIMATION_NOT_FOUND (compName, animationName, loopedCompName) {
    return {
      message: `exit animation: "${animationName}" used on <${loopedCompName}> but not defined in CSS. \nThis will result in component never being removed, as nue.js keeps waiting for the animation to end which does not exist`,
      fix: `To fix this: define animation "${animationName}" in CSS using @keyframes`,
      compName
    }
  },

  /**
   * @param {string} parentCompName
   * @param {string} compName
   * @returns {error}
   */
  MISSING_KEY_ATTRIBUTE (parentCompName, compName) {
    return {
      message: `Missing "key" attribute on <${compName}>`,
      fix: `<${compName}> is looped and needs a key attribute for efficient reconciliation`,
      compName: parentCompName
    }
  },

  /**
   * @param {string} compName
   * @param {string} fnName
   * @returns {error}
   */
  METHOD_NOT_FOUND (compName, fnName) {
    return {
      message: `invalid method "${fnName}" used`,
      fix: `Make sure that "${fnName}" is defined in the fn or it's parent fn`,
      compName
    }
  },

  /**
   * @param {string} compName
   * @param {Element} node
   * @param {string} attributeName
   * @returns {error}
   */
  RESERVED_ATTRIBUTE_USED_ON_NON_COMPONENT (compName, node, attributeName) {
    const nodeName = getNodeName(node)
    return {
      message: `"${attributeName}" attribute can only be used on a nue component, but is used on a non-component node ${nodeName}`,
      fix: `Remove this attribute if ${nodeName} is not a component. \nIf ${nodeName} is actually a nue component, make sure you have added it in ${compName}.uses array so that it can be parsed as a nue component`,
      compName
    }
  },

  /**
   *
   * @param {string} compName
   * @param {string} collectedString
   * @returns {error}
   */
  BRACKET_NOT_CLOSED (compName, collectedString) {
    const text = `"[${collectedString}"`
    const trimmed = `"${collectedString.trim()}"`
    const ifNotPlaceholder = `if ${trimmed} is not a state placeholder: \nprefix the bracket with "!" \n${text} => "![${collectedString}" `
    const ifPlaceholder = `if ${trimmed} is a placeholder: \nInsert closing bracket after ${text}\n${text} => "[${collectedString}]"`
    return {
      message: `Bracket started but not closed \n"[${collectedString}"`,
      fix: `${ifNotPlaceholder}\n\n${ifPlaceholder}`,
      compName
    }
  },

  /**
   *
   * @param {string} compName
   * @param {string} content
   * @returns {error}
   */
  INVALID_INPUT_BINDING (compName, content) {
    return {
      compName,
      message: `functional placeholder used on input binding: \n:input=[${content}]`,
      fix: 'Input binding must be a state placeholder. \nEXAMPLE \n✔ :input=[foo] \n✖ :input=[someFn(bar)] '
    }
  }

}

export default errors
