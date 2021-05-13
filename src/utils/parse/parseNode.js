import { parseAttributes } from './parseAttributes'
import { parseTextNode } from './parseTextNode'
import { parseComp } from './parseComp'

/**
 * parse all types of nodes in context of parentComp
 * and dump the work delayed work to deferredParsingWork array
 * @param {Node} target
 * @param {CompDef} compDef
 * @param {Function[]} deferredParsingWork
 */

export const parse = (target, compDef, deferredParsingWork) => {

  // if target is component, get it's name else it will be undefined
  const targetCompName = compDef._children[target.nodeName]
  const parentCompName = compDef._compName

  // #text
  if (target.nodeType === target.TEXT_NODE) {
    return parseTextNode(/** @type {Text}*/(target), deferredParsingWork, compDef._compName)
  }

  // component
  if (targetCompName) {
    parseComp(/** @type {Comp}*/(target), targetCompName, parentCompName, deferredParsingWork)
  }

  // attributes on component or simple target
  // @ts-expect-error
  if (target.hasAttribute) {
    parseAttributes(/** @type {Parsed_HTMLElement}*/(target), targetCompName)
  }

  // child nodes of component or simple target
  if (target.hasChildNodes()) {
    target.childNodes.forEach(childNode => parse(childNode, compDef, deferredParsingWork))
  }
}
