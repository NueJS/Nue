import { animationAttributes } from '../constants'

/**
 * get name attribute from element
 * @param {HTMLElement} element
 * @param {string} name
 */
export const getAttr = (element, name) => element.getAttribute(name)

/**
  * remove name attribute from element
  * @param {HTMLElement} element
  * @param {string} name
  */
export const removeAttr = (element, name) => element.removeAttribute(name)

/**
  * remove name attribute from element
  * @param {HTMLElement} element
  * @param {string} name
  * @param {string} value
  */
export const setAttr = (element, name, value) => element.setAttribute(name, value)

const { _enter, _exit, _move } = animationAttributes

/**
 * return object containing enter and exit animation info
 * @param {HTMLElement} element
 * @returns {AnimationAttributes_ParseInfo}
 */
export const getAnimationAttributes = (element) => ({
  _enter: getAttr(element, _enter),
  _exit: getAttr(element, _exit),
  _move: getAttr(element, _move)
})
