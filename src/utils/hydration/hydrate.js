// hydration
import { hydrateText } from './hydrateText.js'
import { hydrateAttributes } from './hydrateAttributes.js'
import { hydrateIfComp } from './hydrateIfComp.js'
import { hydrateLoopedComp } from './loop/hydrateLoopedComp.js'

// others
import { isComp } from '../node/isComp.js'
import { conditionAttributes } from '../../constants.js'

/**
 * hydrate target element using _parsedInfo in context of given comp
 * @param {ParsedDOMElement | HTMLElement | Node } target
 * @param {Comp} comp
 * @returns
 */
export const hydrate = (target, comp) => {
  const { _parsedInfo, nodeType } = /** @type {ParsedDOMElement} */(target)

  if (_parsedInfo) {

    comp._nodesUsingLocalState.add(/** @type {ParsedDOMElement} */(target))

    // if target is a comp
    if (/** @type {Comp_ParseInfo} */(_parsedInfo)._isComp) {

      /** @type {Comp}*/(target).parent = comp;
      /** @type {Comp}*/(target)._prop$ = {}

      // if target is looped comp
      if (/** @type {LoopedComp_ParseInfo}*/(_parsedInfo)._loopAttributes) {
        return hydrateLoopedComp(/** @type {LoopedComp}*/(target), comp)
      }

      // if target is condition comp
      // else if used because a looped comp can not be conditional comp too
      else if (/** @type {ConditionalComp_ParseInfo}*/(_parsedInfo)._conditionType === conditionAttributes._if) {
        hydrateIfComp(/** @type {IfComp} */(target), comp)
      }
    }

    // if target is text node
    else if (nodeType === target.TEXT_NODE) {
      return hydrateText(/** @type {Parsed_Text}*/(target), comp)
    }

    // if the target has _attributes
    if (/** @type {HTMLElement_ParseInfo} */(_parsedInfo)._attributes) {
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
