
// in not a valid placeholder, turn it into string
function handleInvalidPlaceholder (node, placeholder) {
  let value
  try { value = placeholder.get_value() } catch { /**/ }
  if (value === undefined) {
    node.textContent = '[' + placeholder.text + ']'
    return true // show that it is invalid
  }

  return false
}

export default handleInvalidPlaceholder
