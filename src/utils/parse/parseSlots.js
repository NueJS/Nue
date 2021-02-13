function parseSlots (comp) {
  // if the component had childNodes
  if (comp.parsed && comp.parsed.childNodes) {
    // for each childNode
    comp.parsed.childNodes.forEach(node => {
      // assume that this node does not have slot attribute, so it goes where the unnamed slot is
      let slotSelector = 'slot:not([name])'

      // if the node is not text node
      if (node.nodeType !== Node.TEXT_NODE) {
        // get the slot name from slot attribute
        const slotName = node.getAttribute('slot')

        // if the slot name is present
        if (slotName) {
          node.removeAttribute('slot')
          // this node will be pushed in the where the named slot is
          slotSelector = `slot[name=${slotName}]`
        }
      }

      // find the target slot in the template of component
      const slot = comp.memo.template.content.querySelector(slotSelector)
      // if the target slot is found, add the node before the slot
      if (slot) slot.before(node)
    })

    // after all the the childNodes are added in template, remove the slot nodes from template
    comp.memo.template.content.querySelectorAll('slot').forEach(s => s.remove())
  }
}

export default parseSlots
