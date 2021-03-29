import { parseAttributes } from './parseAttributes'
import { parseTextNode } from './parseTextNode'
import { parseComp } from './parseComp'

/**
 * parse all types of nodes
 * @param {Node} target
 * @param {Record<string, string>} childCompNodeNames
 * @param {Function[]} deferred
 * @param {Comp} parentComp
 */

export const parse = (target, childCompNodeNames, deferred, parentComp) => {

  // if target is component, get it's name else it will be undefined
  const compName = childCompNodeNames[target.nodeName]

  // #text
  if (target.nodeType === target.TEXT_NODE) {
    return parseTextNode(
      /** @type {Text}*/(target),
      deferred,
      parentComp
    )
  }

  // component
  if (compName) {
    parseComp(
      /** @type {Comp}*/(target),
      compName,
      parentComp,
      deferred
    )
  }

  // attributes on component or simple target
  // @ts-expect-error
  if (target.hasAttribute) {
    parseAttributes(/** @type {Parsed_HTMLElement}*/(target), compName, parentComp)
  }

  // child nodes of component or simple target
  if (target.hasChildNodes()) {
    target.childNodes.forEach(
      childNode => parse(childNode, childCompNodeNames, deferred, parentComp)
    )
  }
}
