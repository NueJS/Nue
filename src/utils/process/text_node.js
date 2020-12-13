import slice from '../slice/slice.js'
import settings from '../../settings.js'
import { FN, REACTIVE } from '../constants.js'
import { addConnects } from '../node/connections.js'
import addDep from '../slice/addDep.js'
import { cbQueuer } from '../callbacks.js'

// @todo move this processing step from process node to in process template
function process_text_node (textNode) {
  const { type, get_value, path, text, deps } = textNode.supersweet.placeholder
  let update

  if (type === REACTIVE) {
    let value
    try { value = get_value() } catch { /**/ }
    // forgive errors - if not a valid placeholder - turn it back to string
    if (value === undefined) {
      textNode.textContent = '[' + text + ']'
      return // do not connect to state
    }

    else {
      textNode.textContent = value
      update = () => {
        if (!textNode.supersweet.isConnected) return
        textNode.textContent = slice(this.$, path)
        if (settings.showUpdates) settings.onNodeUpdate(textNode)
      }
    }
  }

  else if (type === FN) {
    textNode.textContent = get_value()
    update = () => {
      if (settings.showUpdates) settings.onNodeUpdate(textNode)
      textNode.textContent = get_value()
    }
  }

  // @TODO change path to deps - FN will not work like this
  const connect = () => addDep.call(this, path, update, 'dom')
  addConnects(textNode, connect)
  textNode.supersweet.update = update
}

export default process_text_node
