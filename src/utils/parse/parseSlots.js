function parseSlots (comp) {
  // if we need nodes in slot
  if (comp.parsed && comp.parsed.childNodes) {
    comp.parsed.childNodes.forEach(node => {
      let slotSelector = 'slot:not([name])'
      if (node.nodeType !== Node.TEXT_NODE) {
        // slotSelector = 'slot'
        const slotName = node.getAttribute('slot')
        node.removeAttribute('slot')

        if (slotName) {
          slotSelector = `slot[name=${slotName}]`
        }
      }

      const slot = comp.memo.template.content.querySelector(slotSelector)
      if (slot) slot.before(node)
    })

    // remove all slots
    comp.memo.template.content.querySelectorAll('slot').forEach(s => s.remove())
  }
}

export default parseSlots