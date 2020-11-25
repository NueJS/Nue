function dispatchCustomEvent (eventName, detail) {
  this.dispatchEvent(
    new CustomEvent(eventName, {
      detail
    })
  )
}

export default dispatchCustomEvent
