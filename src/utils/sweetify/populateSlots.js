function populateSlots () {
  // if we need nodes in slot
  if (this.sweet && this.sweet.childNodes) {
    this.sweet.childNodes.forEach(node => {
      let slotSelector = 'slot'
      if (node.nodeType !== Node.TEXT_NODE) {
        const slotName = node.getAttribute('slot')
        node.removeAttribute('slot')

        if (slotName) {
          slotSelector += `[name=${slotName}]`
        }
      }

      const slot = this.memo.template.content.querySelector(slotSelector)
      if (slot) slot.before(node)
    })

    // remove all slots
    this.memo.template.content.querySelectorAll('slot').forEach(s => s.remove())
  }
}

export default populateSlots
