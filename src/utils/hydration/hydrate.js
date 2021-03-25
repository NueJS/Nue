// hydration
import { hydrateText } from './hydrateText.js'
import { hydrateAttributes } from './hydrateAttributes.js'
import { hydrateIfComp } from './hydrateIfComp.js'
import { hydrateLoopedComp } from './loop/hydrateLoopedComp.js'

// others
import { isComp } from '../node/isComp.js'
import { attributeTypes } from 'enums.js'

/** @typedef {import('types/dom').Comp } Comp */
/** @typedef {import('types/dom').ParsedDOMElement } ParsedDOMElement */
/** @typedef {import('types/dom').Parsed_HTMLElement } Parsed_HTMLElement */

/** @typedef {import('types/parsed').Comp_ParseInfo } Comp_ParseInfo */
/** @typedef {import('types/parsed').ConditionalComp_ParseInfo } ConditionalComp_ParseInfo */
/** @typedef {import('types/parsed').HTMLElement_ParseInfo } HTMLElement_ParseInfo */
/** @typedef {import('types/parsed').LoopedComp_ParseInfo } LoopedComp_ParseInfo */

/**
 * hydrate the target dom element using it's own _parsedInfo in context of given comp
 * @param {ParsedDOMElement | HTMLElement | Node } target
 * @param {Comp} comp
 * @returns
 */
export const hydrate = (target, comp) => {
  const { _parsedInfo, nodeType } = /** @type {ParsedDOMElement} */(target)

  if (_parsedInfo) {
    comp._nodesUsingLocalState.add(/** @type {ParsedDOMElement} */(target))

    // if target is a comp
    if (/** @type {Comp_ParseInfo} */
      (_parsedInfo)._isComp) {
      // save parent prop
      /** @type {Comp} */
      (target).parent = comp

      // if target is looped comp
      if (/** @type {LoopedComp_ParseInfo}*/
        (_parsedInfo)._loopAttributes) {
        return hydrateLoopedComp(comp, target, _parsedInfo)
      }

      // if target is condition comp
      // else if used because a looped comp can not be conditional comp too
      else if (/** @type {ConditionalComp_ParseInfo}*/
        (_parsedInfo)._conditionType === attributeTypes._conditional) {
        hydrateIfComp(comp, target, _parsedInfo)
      }
    }

    // if target is text node
    else if (nodeType === target.TEXT_NODE) {
      return hydrateText(comp, target, _parsedInfo)
    }

    // if the target has _attributes
    if (/** @type {HTMLElement_ParseInfo} */
      (_parsedInfo)._attributes) {
      hydrateAttributes(
        /** @type {Parsed_HTMLElement}*/(target),
        /** @type {HTMLElement_ParseInfo} */(_parsedInfo)._attributes,
        comp
      )
    }
  }

  // if target is a component, do not hydrate it's childNodes
  if (isComp(target)) return

  // else if it has childNodes hydrate all childNodes
  if (target.hasChildNodes()) {
    target.childNodes.forEach(
      childNode => hydrate(childNode, comp)
    )
  }
}
