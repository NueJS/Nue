import { parseAttributes } from './parseAttributes'
import { parseTextNode } from './parseTextNode'
import { parseComp } from './parseComp'

/**
 * parse all types of nodes in context of parentComp
 * and dump the work delayed work to deferredParsingWork array
 * @param {Node} target
 * @param {Record<string, string>} childrenCompNames
 * @param {Function[]} deferredParsingWork
 * @param {Comp} parentComp
 */

export const parse = (target, childrenCompNames, deferredParsingWork, parentComp) => {

  // if target is component, get it's name else it will be undefined
  const compName = childrenCompNames[target.nodeName]

  // #text
  if (target.nodeType === target.TEXT_NODE) {
    return parseTextNode(
      /** @type {Text}*/(target),
      deferredParsingWork,
      parentComp
    )
  }

  // component
  if (compName) {
    parseComp(
      /** @type {Comp}*/(target),
      compName,
      parentComp,
      deferredParsingWork
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
      childNode => parse(
        childNode,
        childrenCompNames,
        deferredParsingWork,
        parentComp
      )
    )
  }
}
