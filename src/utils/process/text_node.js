import slice from '../slice/slice.js'
import settings from '../../settings.js'
import { FN, REACTIVE } from '../constants.js'
import { add_connects } from '../node/connections.js'
import add_state_dep from '../slice/add_state_dep.js'

// @todo move this processing step from process node to in process template
function process_text_node (text_node) {
  const placeholder = this.memo_of(text_node)
  // if (!placeholder) return // when can this happen ?

  const { type, get_value, path, text, deps } = placeholder
  let update

  if (type === REACTIVE) {
    let value
    try { value = get_value() } catch { /**/ }
    // forgive errors - if not a valid placeholder - turn it back to string
    if (value === undefined) {
      text_node.textContent = '[' + text + ']'
      return // do not connect to state
    }

    else {
      text_node.textContent = value
      update = () => {
        if (!text_node.connected_to_state) return
        text_node.textContent = slice(this.$, path)
        if (settings.showUpdates) settings.onNodeUpdate(text_node)
      }
    }
  }

  else if (type === FN) {
    text_node.textContent = get_value()
    update = () => {
      if (settings.showUpdates) settings.onNodeUpdate(text_node)
      text_node.textContent = get_value()
    }
  }

  const connect = () => add_state_dep.call(this, path, update, 'dom')
  add_connects(text_node, connect)
  text_node.update_value = update
}

export default process_text_node
