import slice from '../slice/slice.js'
import settings from '../../settings.js'
import { FN, REACTIVE } from '../constants.js'
import { addConnects } from '../node/connections.js'
import addDep from '../slice/addDep.js'
import { cbQueuer } from '../callbacks.js'

// @todo move this processing step from process node to in process template
function process_text_node (textNode) {
  const { type, get_value, text, deps } = textNode.supersweet.placeholder

  if (type === REACTIVE) {
    let value
    try { value = get_value() } catch { /**/ }
    // in not a valid placeholder, turn it into string
    if (value === undefined) {
      textNode.textContent = '[' + text + ']'
      textNode.supersweet.placeholder = undefined
    }
  }

  else {
    const update = () => {
      textNode.textContent = get_value()
    }

    update()
    const connect = () => deps.map(path => addDep.call(this, path, update, 'dom'))
    addConnects(textNode, connect)
    textNode.supersweet.update = update
  }
}

export default process_text_node
